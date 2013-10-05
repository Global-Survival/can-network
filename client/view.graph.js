var layoutFPS = 30;
var graphUpdatePeriod = 1000 / layoutFPS; //in ms

function renderGraph(s, o, v, withGraph) {
    
	var gw = { };

    var ee = uuid();
	var r = newDiv('"slateContainer"');
	r.attr('style', 'width:100%; height:100%;');	
	v.append(r);

	var l = newDiv('slate');
	r.append(l);
    
	function updateGraph() {
		later(function() {
		    initCZ(function() {
		    	
				/*if (!$s)*/ {
	
					$s = new Slatebox();
					theSlate = $s.slate({
						id: 'firstSlateExample' //slate with the same ids can collaborate together.
						, container: 'slate'
						, viewPort: { width: 50000, height: 50000, allowDrag: true, left: 5000, top: 5000 }
						, showZoom: true
						, showBirdsEye: false
						, showStatus: false
						, showMultiSelect: false
						, onSlateChanged: function (subscriberCount) {
							upd();
						}
						, collaboration: {
							allow: false
				/*                        , showPanel: false
							, url: 'http://slatebox.com'
							, jsonp: true
							, userName: "Tester"
							, userIP: 1
							, userProfile: ''
							, callbacks: {
								onCollaboration: function (name, msg) {
								    var secs = Math.round(new Date().getTime() / 1000) - startTime;
								    log.push(secs + " secs ago - " + name + ": " + msg.toLowerCase());
								    Slatebox.el("slateMessage").innerHTML = log.reverse().join('<br/>');
								    startTime = Math.round(new Date().getTime() / 1000);
								    upd();
								}
							}
				*/

						}
					}).canvas.init({ imageFolder: "/lib/slateboxjs/cursors/" });
				}

				graphCZ(r, function(root) {	
		            var width = 1400;
		            var height = 1300;
					var layout = { };
		            
		            var sys = arbor.ParticleSystem(1500, 762, 0.5);                
		            sys.screenPadding(20);
		            sys.screenSize(width, height);
		            sys.parameters({"fps":layoutFPS, "repulsion":4400,"friction":0.2,"stiffness":25,"gravity":false});
		            
		            sys.start();
		            
		            var nodeShapes = { }, nodeNodes = { };
		            var edgeShapes = { };
		            
		            
					layout.addNode = function (nodeID, shape) {
						nodeNodes[nodeID] = sys.addNode(nodeID);
						nodeShapes[nodeID] = shape;

					};
					layout.addEdge = function(from, to, edge) {
						sys.addEdge(from, to, edge);
					};

		            
		            var offsetX = width;
		            var offsetY = height/2.0;
		            var iterations = 30;

		            var updater = setInterval(function() {
		                
						iterations--;

		                if ((!l.is(':visible')) || (iterations == 0)) { 
		                    //STOP
		                    clearInterval(updater);
		                    sys.stop();
							console.log('layout stop');
		                    return;
		                }

		                sys.eachNode(function(x, pi) {
		                   var s = nodeShapes[x.name];                       
		                   if (s) {
								s.setPosition({
									x: pi.x + 5000,
									y: pi.y + 5000
								});
		                   }
		                });
		                
		                /*sys.eachEdge(function(edge, p1, p2) {
		                    var e = edgeShapes[edge.data.id];
		                    if (e) {
		                        var cx = 0.5 * (p1.x + p2.x) - offsetX;
		                        var cy = 0.5 * (p1.y + p2.y) - offsetY;
		                        
		                        var dy = p2.y - p1.y;                            
		                        var dx = p2.x - p1.x;
		                        
		                        var angle = Math.atan2( dy, dx );
		                        
		                        var dist = Math.sqrt( dy*dy + dx*dx );
		                        
		                        e.width = dist;
		                        
		                        moveShape(e, cx, cy, angle);
		                    }
		                });*/

					

		            }, graphUpdatePeriod);

					return layout;
		 
		            
				}, withGraph);								
			});
		    
		});
	}
	updateGraph();

	gw.onChange = updateGraph();
	return gw;

}



function renderGraphFocus(s, o, v) {
	var maxGraphNodes = 75;

    renderGraph(s, o, v, function(g) {
        renderItems(s, o, v, maxGraphNodes, function(s, v, xxrr) {
            var tags = { };
            
            for (var i = 0; i < xxrr.length; i++) {
                var x = xxrr[i][0];
                var r = xxrr[i][1];
                g.addNode(x.id, { label: x.name || "" } );
                
                var rtags = objTags(x);

                if (!rtags) 
                    continue;

				if (x.author)
					rtags.push('Self-' + x.author);

				//add Tags (intensional inheritance)
                for (var j = 0; j < rtags.length; j++) {
                    var tj = rtags[j];
                    var exists = tags[tj];
                    if (!exists) {
                        var ttj = s.tag(tj) || s.object(tj) || null; // || { name: '<' + tj + '>' };
						if (!ttj)
							continue;
                        g.addNode(tj, { label: ttj.name||"" }, ttj ? getTagIcon(tj) : null);
                        tags[tj] = true;
                    }
                    g.addEdge(x.id+'_' + j, x.id, tj);
                }
            }
            
        });        
    });
}


var codeLoading = false;
var codeLoaded = false;

function initCZ(f) {
    if (codeLoaded) {
        f();
    }
    else {
		if (codeLoading)
			return;

		codeLoading = true;

        var scripts = [ 

			"/lib/slateboxjs/slatebox.js",
			"/lib/slateboxjs/slatebox.slate.js",
			"/lib/slateboxjs/slatebox.node.js",

			"/lib/slateboxjs/raphael/raphael.el.tooltip.js",
			"/lib/slateboxjs/raphael/raphael.el.loop.js",
			"/lib/slateboxjs/raphael/raphael.el.style.js",
			"/lib/slateboxjs/raphael/raphael.button.js",
			"/lib/slateboxjs/raphael/raphael.fn.connection.js",
			"/lib/slateboxjs/raphael/raphael.fn.objects.js",

			"/lib/slateboxjs/node/Slatebox.node.editor.js",
			"/lib/slateboxjs/node/Slatebox.node.shapes.js",
			"/lib/slateboxjs/node/Slatebox.node.menu.js",
			"/lib/slateboxjs/node/Slatebox.node.toolbar.js",
			"/lib/slateboxjs/node/Slatebox.node.context.js",
			"/lib/slateboxjs/node/Slatebox.node.colorpicker.js",
			"/lib/slateboxjs/node/Slatebox.node.links.js",
			"/lib/slateboxjs/node/Slatebox.node.connectors.js",
			"/lib/slateboxjs/node/Slatebox.node.relationships.js",
			"/lib/slateboxjs/node/Slatebox.node.images.js",
			"/lib/slateboxjs/node/Slatebox.node.template.js",
			"/lib/slateboxjs/node/Slatebox.node.resize.js",

			"/lib/slateboxjs/spinner.js",
			"/lib/slateboxjs/emile/emile.js",
			"/lib/slateboxjs/notify.js",

			"/lib/slateboxjs/slate/Slatebox.slate.canvas.js",
			"/lib/slateboxjs/slate/Slatebox.slate.message.js",
			"/lib/slateboxjs/slate/Slatebox.slate.multiselection.js",
			"/lib/slateboxjs/slate/Slatebox.slate.nodes.js",

			"/lib/slateboxjs/slate/Slatebox.slate.zoomSlider.js",
			"/lib/slateboxjs/slate/Slatebox.slate.keyboard.js",
			"/lib/slateboxjs/slate/Slatebox.slate.birdseye.js",

             '/lib/arbor/arbor.js'
        ];
        
        loadCSS('/lib/slateboxjs/example.css');        

		function ff() {
	        codeLoaded = true;
			f();
		}

        LazyLoad.js(scripts, ff);


    }
	
}

var vc;
var $s, theSlate;

function graphCZ(canvasElement, init, withGraph) {
	var layout = init(canvasElement);


    var log = [], startTime = Math.round(new Date().getTime() / 1000);

    function upd() {
        Slatebox.el("txtSlateJson").value = theSlate.exportJSON();
        Slatebox.el("txtSlateLastUpdated").innerHTML = "last updated <b>" + new Date().toString();
    };

	//console.log($s);
    //this.paper.clear();
    theSlate.nodes.allNodes = [];


	//console.log(theSlate.zoomSlider);

	var zoomValue = 15000;
	var zoomDelta = 2500;
	var maxZoom = 200000;	//taken from Slatebox.slate.zoomSlider.js
	var minZoom = 6000; 

	function MouseWheelHandler(e) {

		// cross-browser wheel delta
		var e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		if (delta < 0) {
			zoomValue += zoomDelta;
		}
		else {
			zoomValue -= zoomDelta;
		}
		if (zoomValue > maxZoom) zoomValue = maxZoom;
		if (zoomValue < minZoom) zoomValue = minZoom;
		theSlate.zoomSlider.set(zoomValue);

		return false;
	}

	var s = document.getElementById("slate");
	if (s.addEventListener) {
		s.addEventListener("mousewheel", MouseWheelHandler, false);
		s.addEventListener("DOMMouseScroll",MouseWheelHandler,false);
	}
	else s.attachEvent("onmousewheel", MouseWheelHandler);


	var _nodes =  [];
	var _edges = [];
	var _nodeIndex = { };

    /*var _nodes = [
        $s.node({ id: 'first_node', text: 'drag', xPos: 5090, yPos: 5120, height: 40, width: 80, vectorPath: 'roundedrectangle', backgroundColor: '90-#ADD8C7-#59a989', lineColor: "green", lineWidth: 2, allowDrag: true, allowMenu: true, allowContext: true })
        , $s.node({ id: 'second_node', text: 'me', xPos: 5290, yPos: 5080, height: 40, width: 100, vectorPath: 'ellipse', backgroundColor: '90-#6A8FBD-#54709a', lineColor: "green", lineWidth: 4, allowDrag: true, allowMenu: true, allowContext: true })
        , $s.node({ id: 'third_node', text: 'around', xPos: 5260, yPos: 5305, height: 40, width: 80, vectorPath: 'rectangle', backgroundColor: '90-#756270-#6bb2ab', lineColor: "blue", lineWidth: 5, allowDrag: true, allowMenu: true, allowContext: true })
    ];*/

	var g = {
		addNode : function(id, n) {
			var x = 5000+Math.random() * 2000;
			var y = 5000+Math.random() * 2000;
			var nn = $s.node({ id: id, text: n.label, xPos: x, yPos: y, height: 40, width: 80, 
					vectorPath: 'rectangle', 
					backgroundColor: n.color||'white', //'90-#ADD8C7-#59a989', 
					lineColor: "black", lineWidth: 3, allowDrag: true, allowMenu: true, allowContext: true })

			_nodes.push(nn);
			_nodeIndex[id] = nn;
			layout.addNode(id, nn);
		},
		addEdge : function(e, from, to) {
			_edges.push( [ from, to, e] );
			layout.addEdge(from, to, { id: e } );
		}
	};

	if (withGraph)
		withGraph(g);

    theSlate.nodes.addRange(_nodes);
	for (var i = 0; i < _edges.length; i++) {
		//console.log(i);
		var ee = _edges[i];
		var f = ee[0];
		var t = ee[1];
		var e = ee[2];

		if (f==t)
			continue;
		if (!_nodeIndex[t]) {
			//console.log('Missing node: ', t);
			continue;
		}
	

		if (_nodeIndex[f])
			_nodeIndex[f].relationships.addAssociation(_nodeIndex[t], { });
		else {
			//console.log('Edge missing node: ', f);
		}
	}

    theSlate.init();

}

$(window).bind('resize', function () {
    updateLayout();
});

function updateLayout() {
}
