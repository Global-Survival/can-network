//retrieves a google doc spreadsheet as CSV and converts it to timeglider JSON timeline format:

// input (columns):
// ex: https://docs.google.com/spreadsheet/ccc?key=0AgCqCoDPAuA2dC1WbHoyS1JJTDVwcW11RnNOYjdZQWc// ...
/*
	start_date
	start_time
	end_date
	end_time
	title
	description
	locations
	image_link
	link
	importance
	color
	class

	EXTRA CLASSES:
		Related Activities
		Response
		On-Site Location

*/
var csv = require('ya-csv');
var _ = require('underscore');

var events = [];

var reader = csv.createCsvStreamReader(process.openStdin(), { columnsFromHeader: true });
reader.addListener('data', function(e) {
    // supposing there are so named columns in the source file
    //console.log(JSON.stringify(e, null, 4));

	//TODO parse start_date and start_time into a Unix time
	//TODO handle case when start_date present but start_time NOT present
	if (e.start_date)
		if (e.start_time)
			e.start = e.start;
	if (e.end_date)
		if (e.end_time)
			e.end = e.end;

	//TODO parse shortcodes present in description that reference extra columns by their name
	if (e.description)
		e.description = e.description;

	events.push(e);
});
reader.addListener('end', function() {
	//console.log(events.length + ' events loaded.');
	console.log( JSON.stringify(getTimeGliderJSON(events), null, 4) );
});


// output (timeglider json | vertical-timeline json | netention -> mongodb):
// 	json: http://enformable.com/timeline/fukushima2.json
//  http://timeglider.com/widget/index.php?p=json
/* {
    "id": "jshist",
    "title": "A little history of JavaScript",
    "focus_date": "2001-01-01 12:00:00",
    "initial_zoom": "43",
    "timezone": "-07:00",
    "events": [
    	{
		  "id": "jshist-01",
		  "title": "Mocha - Live Script",
		  "description": "JavaScript was originally developed by Brendan Eich of 
			          Netscape under the name Mocha. LiveScript was the official name for the
			          language when it first shipped in beta releases of Netscape Navigator 2.0
			          in September 1995",
		  "startdate": "1995-04-01 12:00:00",
		  "enddate": "1995-04-01 12:00:00",
		  "date_display": "month",
		  "link": "http://en.wikipedia.org/wiki/JavaScript",
		  "importance": 40,
		  "icon":"square_blue.png"
		},
*/

function getTimeGliderJSON(events) {
	var x = {
		id: '_',
		title: "_",
    	//focus_date: "2001-01-01 12:00:00",
	    //"initial_zoom": "43",
	    //"timezone": "-07:00",
		events: []
	};

	var y = x.events;

	for (var i = 0; i < events.length; i++) {
		var n = _.clone(events[i]);
		/*n.startdate = n.start_date + ' ' + n.start_time;
		if (n.end_date)
			n.enddate = n.end_date + ' ' + n.end_time;*/
		n.id = 	'_' + i;
		y.push(n);
	}
	return x;
}


//http://enformable.com/timeline/fukushima2.html
//  client: view-source:http://enformable.com/timeline/fukushima2.html

