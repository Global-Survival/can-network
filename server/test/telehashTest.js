var tele = require("telehash");

var fs = require("fs");

tele.genkey(function(err, seedKey){
	//CREATE SEED
  	fs.writeFileSync("./seed.public", JSON.stringify( { public: seedKey.public }, null, 4));  

	var seed = tele.hashname(seedKey, { port: 10002 });
	console.log("seed online at", seed.ip+":"+seed.port, "with the hashname", seed.hashname);

	seed.listen("object", function(err, stream, js) {
		console.log('received object: ', js);
	});

	//CREATE CLIENT
	tele.genkey(function(err, clientKey){
		var client= tele.hashname(clientKey);

		client.addSeed({ip:"localhost",port:10002,pubkey:seedKey.public});

		client.online(function(err) {
			console.log("client online status", err?err:true, client.hashname);

			client.stream(seed.hashname, "object"/*, function(err, stream, js) {
			}*/).send('hi');
		});

	});

});


