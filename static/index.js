let labelType, useGradients, nativeTextSupport, animate;

(function() {
  let ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

function init(){
    let st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
		levelsToShow: 10,
		offsetX: 350,
        //set duration for the animation
        duration: 0,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 50,
        //enable panning
        Navigation: {
          enable:true,
          panning:true
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 35,
            width: 75,
            type: 'rectangle',
            color: '#aaa',
            overridable: true
        },
        
        Edge: {
            type: 'bezier',
            overridable: true
        },
        
        onBeforeCompute: function(node){
        },
        
        onAfterCompute: function(){
        },
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
            label.id = node.id;            
            label.innerHTML = node.name;
            label.onclick = function(){
				console.log(node.data);	
				//st.onClick(node.id);
            }; //set label styles
            let style = label.style;
            style.width = 60 + 'px';
            style.height = 17 + 'px';            
            style.cursor = 'pointer';
            style.color = 'black';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        },
        
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
            //add some color to the nodes in the path between the
            //root node and the selected node.
		node.data.$color = ['#aa5555','#aaaa55'][node.data.up?1:0];
		if (typeof node.data.responsive !== 'undefined' && node.data.responsive ||
			typeof node.data.resolvable !== 'undefined' && node.data.resolvable){
				node.data.$color = '#55aa55';
			}
        },
        
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
	reloadData(st);
	setInterval(function(){reloadData(st);},30000);
}

function reloadData(st){
	fetch('/tree')
		.then(function(response){
			if (response.status >= 200 && response.status < 300){
				return response.text();
			}else{
				return Promise.reject(new Error());
			}})
		.then(JSON.parse)
		.then(function(response){
			json = response;
			st.loadJSON(response);
			st.compute();
			st.onClick(st.root);
		}).catch(function(){});
}
