(function(){

function $(id){return document.getElementById(id);}
	window.onload = function(){
		reloadData();
		setInterval(reloadData, 60000);
	};


	function checkStatus(response){
		if (response.status >= 200 && response.status < 300){
			return response.text();
		}else{
			return Promise.reject(new Error());
		}
	}

	function reloadData(){
		fetch('/history')
			.then(checkStatus)
			.then(JSON.parse)
			.then(function(response){
				//console.log(response);	
				constructDisplay(response);
			}).catch(function(){});
	}
	
	function constructDisplay(stat){
		container = $('container');
		container.innerHTML = "";
		len = stat.headers.length
		for ( let i = 0; i < len; i++){
			service = document.createElement('DIV');
			service.classList.add('service');
			head = document.createElement('DIV');
			head.classList.add('head');
			head.classList.add('box');
			head.innerHTML = stat.headers[i]
			service.appendChild(head);
			nscans = stat.status.length;
			for ( let j = nscans - 1; j >= 0; j--){
				check = document.createElement('DIV');
				check.classList.add('box');
				if (i != 0){
					if (stat.status[j][i] == 1){
						check.classList.add('up');
					} else {
						check.classList.add('down');
					}
				} else {
					check.classList.add('time');
					check.innerHTML = stat.status[j][i];
				}
				service.appendChild(check);
			}
			container.appendChild(service);
		}
	}
})();
