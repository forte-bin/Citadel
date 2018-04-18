#!/usr/bin/env python3
import os
from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug.wsgi import SharedDataMiddleware
from werkzeug.utils import redirect
from jinja2 import Environment, FileSystemLoader
from sentry import Sentry
class Citadel(object):

	def __init__(self):
		template_path = os.path.join(os.path.dirname(__file__), 'templates')
		self.jinja_env = Environment(loader=FileSystemLoader(template_path),autoescape=True)
		self.url_map = Map([
		    Rule('/', endpoint='index'),
		    Rule('/tree', endpoint='tree'),
			Rule('/manage', endpoint='manage'),
			Rule('/status', endpoint='status'),
			Rule('/history', endpoint='history'),
		])	
		self.sentry = Sentry()

	def	dispatch_request(self, request):
		adapter = self.url_map.bind_to_environ(request.environ)
		try:
			endpoint, values = adapter.match()
			return getattr(self, 'on_' + endpoint)(request, **values)
		except HTTPException as e:
			return e

	def	wsgi_app(self, environ, start_response):
		request = Request(environ)
		response = self.dispatch_request(request)
		return response(environ, start_response)

	def	__call__(self, environ, start_response):
		return self.wsgi_app(environ, start_response)

	def render_template(self, template_name, **context):
	    t = self.jinja_env.get_template(template_name)
	    return Response(t.render(context), mimetype='text/html')

	def on_index(self, request):
		return self.render_template('index.html')

	def on_tree(self, request):
		return Response(self.sentry.getStatusTree())

	def on_status(self, request):
		return self.render_template('status.html')
	
	def on_history(self, request):
		return Response(self.sentry.getRecentStatuses())

def create_app(with_static=True):
	app = Citadel()
	if with_static:
		app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
		'/static':  os.path.join(os.path.dirname(__file__), 'static')
		})
	return app


	
if __name__ == '__main__':
	from werkzeug.serving import run_simple
	app = create_app()
	run_simple('0.0.0.0', 80, app, use_debugger=True, use_reloader=False)
