/**
 * @author seh
 * 
 * https://github.com/diaspora/diaspora/wiki/Federation-Protocol-Overview
 * https://github.com/quartzjer/node-telehash
 */

var DEFAULT_TELEHASH_PORT = 10901;

exports.plugin = {
        name: 'Telehash',	
		description: 'P2P Messaging Network',
		options: { },
        version: '1.0',
        author: 'http://telehash.org',
        
		start: function(netention, util) {

			/*
			TelehashNode:
				IP
				Public Key
				inFilter - null means anything passes thru, otherwise it's a boolean tag expression
				outFilter - null means everything broadcasts out, otherwise a tag expression
				lastReceived [ro]
				connected? [ro]
			*/
			netention.addTags([	
                {
                    uri: 'TelehashNode', name: 'Telehash Node', 
                    properties: {
                        'telehashname': { name: 'Hashname', type: 'text', min: 1, max: 1, readonly: true },
                        'telehashAddress': { name: 'IP:port', type: 'text' , min: 1, max: 1, default: ('0.0.0.0:' + DEFAULT_TELEHASH_PORT) },
                        'telehashPublicKey': { name: 'Public key', type: 'textarea', min: 1, max: 1 },
                        'connected': { name: 'Connected', type: 'boolean' },
                        'lastReceived': { name: 'Last received',  type: 'timepoint' }
                    }
                }
            ]);

			var tele = require("telehash");


			tele.genkey(function(err, seedKey){
				var node = tele.hashname(seedKey, { port: DEFAULT_TELEHASH_PORT });

				var hashnames = { };

				function connect(x) {
					var hashname = util.objFirstValue(x, 'telehashname');
					var addr = util.objFirstValue(x, 'telehashAddress');
					var publicKey = util.objFirstValue(x, 'telehashPublicKey');

					if (hashname && addr && publicKey) {
						var ip = addr.split(':')[0];
						var p = parseInt(addr.split(':')[1]);

						console.log('Telehash connect: ', ip, p);

						node.addSeed({ip:ip,port:p,pubkey:publicKey});

						function ping() {
							node.stream(hashname, "object"/*, function(err, stream, js) {
							}*/).send('client');
						}
	
						setInterval(ping, 5000);
					}
				}

				var selfNode = util.objNew('TelehashNode_Local', 'Telehash');
				util.objAddTag(selfNode, 'TelehashNode');
				util.objAddValue(selfNode, 'telehashname',  node.hashname);
				util.objAddValue(selfNode, 'telehashAddress',  netention.server.host + ':' + DEFAULT_TELEHASH_PORT);
				util.objAddValue(selfNode, 'telehashPublicKey', seedKey.public );
				netention.pub(selfNode);

				node.online(function(err) {
					netention.getObjectsByTag('TelehashNode', function(x) {
						if (x.id=='TelehashNode_Local')
							return;
						connect(x);
		            });
					//console.log("client online status", err?err:true, client.hashname);

					//client.stream(seed.hashname, "object"/*, function(err, stream, js) {
					//}*/).send('hi');
					

				});
				node.listen("object", function(err, stream, js) {
					console.log('telehash received object: ', js);
				});
			

			});

		},

        notice: function(x) {
            if (util.objHasTag(x, 'TelehashNode')) {
				connect(x);
            }
        },
        
		stop: function(netention) {
            /*if (this.loop) {
                clearInterval(this.loop);
                this.loop = null;
            } */  
		}
};
