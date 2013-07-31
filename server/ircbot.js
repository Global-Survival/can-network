//https://node-irc.readthedocs.org/en/latest/API.html#client
//http://davidwalsh.name/nodejs-irc
var irc = require('irc');

//https://github.com/kirsle/rivescript-js
var RiveScript = require("../plugin/rivescript/rivescript/bin/RiveScript.js");

var _= require('underscore');

//000000000000000000000000000000000000000000000000000000000000

var channel = '#netention';

var client = new irc.Client('irc.freenode.net', 'undefined_', {
		channels: [channel],
});

var bot = new RiveScript({ debug: false });
bot.loadDirectory("./plugin/rivescript/rivescript/eg/brain", function() { 

	bot.sortReplies();
	bot.ready = true;

}, error_handler);

// Listen for any message, say to him/her in the room
client.addListener("message", function(from, to, text, message) {
	if (to === channel)
		client.say(channel, bot.reply(from, text));
});

function error_handler (loadcount, err) {
	console.log("Error loading batch #" + loadcount + ": " + err + "\n");
}
