/* Value Network 

*/
var request = require('request');

exports.plugin = {
        name: 'Value Network',	
		description: '',
		options: { },
        version: '1.0',
        author: 'https://github.com/valnet/valuenetwork',
        
		start: function(netention, util) { 
            
            
            netention.addTags([
                {
                    uri: 'ProcessNetwork', name: 'Process Network', 
                    properties: {
                        'processNetworkURL': { name: 'URL', type: 'text' /* url */, min: 1, default: 'http://' },
                        'processNetworkUpdatePeriod': { name: 'Fetch Period (seconds)', type: 'real' /* number */, default: "3600", min: 1, max: 1 },
                        'lastProcessNetworkUpdate': { name: 'Last RSS Update',  type: 'timepoint' }
                    }
                },
                {
                    uri: 'ProcessNode', name: 'Process',
                    properties: {
                        'processPrevious': { name: 'Previous', type: 'object' },
                        'processNext': { name: 'Next', type: 'object' }
                    }
                }
            ]);

			var update = this.update = function(x) {
				//http://valdev.webfactional.com/accounting/json-processes/valdev.webfactional.com/accounting/json-processes/
				//http://valnet.webfactional.com/accounting/json-processes/

				var url = util.objFirstValue(x, 'processNetworkURL');
				console.log('Updating value network: ' + url);
				request(url, function (error, response, body) {
					if (error) {
						console.log('ERROR: ' + error);
						return;
					}
					var b = JSON.parse(body);
					var nodes = b.nodes;
					var edges = b.edges;
					console.log(nodes.length + ' nodes, ' + edges.length + ' edges');
				});

			}

			netention.getObjectsByTag('ProcessNetwork', function(x) {				
				update(x);
            });

		},
                
        notice: function(x) {
            /*if (util.objHasTag(x, 'ProcessNetwork')) {
                this.update();
            }*/
        },
        
		stop: function(netention) {
            /*if (this.loop) {
                clearInterval(this.loop);
                this.loop = null;
            } */  
		}
};
            
