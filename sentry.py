from multiprocessing import Process
from threading import Thread
import subprocess, shlex
import yaml, json
import sys, time, os, datetime

LOGFILE = 'status.csv'

class StatusNode(object):
	def __init__(self, node):
		if isinstance(node, HostNode):
			self.id = node.hostname+':' + node.ip
			self.name = node.hostname
			self.children = [StatusNode(service) for service in node.services]
			self.children += [StatusNode(host) for host in node.children]
		elif isinstance(node, ServiceNode):
			self.id = node.name + '@' + node.ip
			self.name = node.name
			self.children = []
		else:
			raise TypeError()
		self.data = {'up':node.up}

class HostNode(object):
	def __init__(self, configObject):
		self.hostname = configObject['hostname']
		self.ip = configObject['ip']
		self.resolver = configObject['resolver']
		self.fqdn = configObject['fqdn']
		self.children = [HostNode(child) for child in configObject['children']]
		self.services = [ServiceNode(service, self) for service in configObject['services']]
		self.up = False

class ServiceNode(object):
	def __init__(self, serviceObject, host):
		self.ip = host.ip
		self.name = serviceObject['name']
		self.port = serviceObject['port']
		self.check = serviceObject['check']
		self.up = False

class Sentry(object):
	#constructor, set up scanner
	def	__init__(self, delay=60):
		self.delay = delay
		self.root = None
		self.loadConfig()
		scanner = Thread(target=self)
		scanner.daemon = True
		scanner.start()

	#scanner target, runs as a daemon
	def __call__(self):
		try:
			file_exists = os.path.isfile(LOGFILE)
			#if file is empty write header
			if not file_exists or os.stat(LOGFILE).st_size == 0:
				headers = ['time']
				self.getServiceNameList(self.root, headers)	
				with open(LOGFILE, 'a' if file_exists else 'w') as statuslog:
					statuslog.write(', '.join(i for i in headers)+'\n')
			#begin scanning for services
			while True:
				now = datetime.datetime.now()
				now = str(now.hour % 12) + ':' + str(now.minute)
				statuses = [now]
				self.scanHost(self.root, statuses)				
				with open(LOGFILE,'r') as statuslog:
					h = statuslog.readline().split(', ')
					if len(statuses) != len(h):
						print(h)
						print(statuses)
						raise ValueError('active status array not the same size as the header line')
				with open(LOGFILE,'a') as statuslog:
					statuslog.write(', '.join(str(i) for i in statuses)+'\n')
				time.sleep(self.delay)
		except (KeyboardInterrupt):
			pass

	def getRecentStatuses(self):
		result = {}
		with open(LOGFILE, 'r') as statuslog:
			result['headers'] = statuslog.readline().replace('\n','').split(', ')
			recent = [line.replace('\n','').split(', ') for line in statuslog.readlines()]
			if len(recent) <= 10:
				result['status'] = recent
			else:
				result['status'] = recent[-10:]
		return json.dumps(result)

	def	getServiceNameList(self, node, namelist):
		for i in node.services:
			namelist.append(i.name + '@' + i.ip)
		for i in node.children:
			self.getServiceNameList(i,namelist)

	#scan a single host, and it's services
	def scanHost(self, host, logList=None, recurse=True):
		#ping(host.ip) |> host.up
		host.up = not os.system('ping -c 1 -w2 ' + host.ip + ' > /dev/null')
		for service in host.services:
			self.scanService(service, logList)
		if recurse:
			for child in host.children:
				self.scanHost(child, logList)

	#scan a single service
	def scanService(self, service,logList=None):
		nmapcmd = '/usr/bin/nmap -Pn -p ' + str(service.port) + ' ' + service.ip
		service.up = 'open' in str(subprocess.check_output(nmapcmd, shell=True))
		checkcmd = service.check
		service.responsive = False
		if checkcmd != '':
			#print(checkcmd)
			try:
				output = subprocess.check_output(checkcmd, shell=True)
				service.responsive = output in ['1', '1\n', b'1', b'1\n']
				print(service.responsive)
			except PermissionError:
				print('PermissionError executing \"' + checkcmd + '\" , service check fails')
			except subprocess.CalledProcessError:
				print('weird error executing checkcmd, non-zero exit status')

		result = 1 if service.responsive else 0
		logList.append(str(result))

	#get tree representation of the status of the network
	def getStatusTree(self):
		return json.dumps(StatusNode(self.root),default=lambda o: o.__dict__, sort_keys=True)
	
	#load file
	def loadConfig(self):
		config = None
		try:
			with open('config.yaml','r') as config_file:
				config = yaml.load(config_file)
				
		except FileNotFoundError:
			print('Fatal: Config File "config.yaml" not found!')
			sys.exit(1)
		if config is None:
			print('Fatal: failed to load config')
			sys.exit(1)
		
		#reverse parent links to be links to children
		hosts_by_name = {}
		for host in config:
			hosts_by_name[host['hostname']] = host
			host['children'] = []
		for host in config:
			if host['parent'] is not None:
				hosts_by_name[host['parent']]['children'].append(host)
			del host['parent']
		#import the config into useful objects
		self.root = HostNode(config[0])

