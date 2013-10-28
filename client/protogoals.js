/* 

Acquire Item (ex: store purchase or borrow/trade)


Increase Sex Drive
Increase Healing Ability
Increase Relaxation
Increase Brainstorming

Consume Item
	Quantity Range (Dose)
	Frequency
	Ingestion Method
		Orally
		Sublingually
		IV
	…
	Contraindications/Indications

Gather / Ready / Deploy / Attend_to Item (get it ready for use)
	saving minutes in the case of an emergency could save a life

Share Item

Travel

Contact

Relax / Do Nothing / Be Patient / Breathe


Personal Conditions
	Biometrics
		Age
		Weight
		Height
		Gender
		Temperature
		Ethnicity
		Blood type
		Genetics
		Pulse Rate & Variability
		Blood Pressure
		Breathing Rate
		...
	Hunger / Thirst
		...
	Memory
	Focus
	Mood
		Stability
		Presence of Depression
		Presence of Euphoria
	Energy
	Relax
	Athletic Performance
	Illness
	Injury
		[per body part]
	Need to Detox and Stop...
		Alcohol Addiction
		Opiate Addiction
		Cocaine / Amphetamine Addiction
		Benzodiazepine Addiction
		Nicotine Addiction
		Sugar Addiction
		Other Addictions and their cravings

Environment Conditions
	Time 
		of Day
		of Year
	Weather
		Rain Storm
		Snow
		Tropical Storm
		Hurricane
		Tornado
		Tsunami
		..
	Pollution
		Air/Water Quality
		Radiation
		Electrosmog
		...
	Crime
	Economic
	Sociopolitical
		Vote
		Taxes
		...
	Cultural
		Holidays
	Farming / Plant Maintenance

Resource Inventory
	[Item, Quantity]
	Cash [Currency, Quantity]

Social Conditions
	Relationship Quality
		Animals / Pets
		Strangers
		Coworker
		Student / Teacher
		Friend
		Family
		Roommate
		Boyfriend/Girlfriend
		Spouse
*/
function newGoal(protogoal) {
	var g = objNew(uuid(), protogoal.name + ' (Goal)');
	g = objAddTag(g, 'Goal', 1.0);
	g.author = self.id();

	if (protogoal.tags)
		for (var i = 0; i < protogoal.tags.length; i++)
			g = objAddTag(g, protogoal.tags[i], 1.0);

	return g;
}

function saveGoal(g) {
	self.pub(g, function(err) {
                $.pnotify({
                    title: 'Unable to save.',
                    text: g.name,
                    type: 'Error'            
                });                
            }, function() {
                $.pnotify({
                    title: 'Saved (' + g.id.substring(0,6) + ')' ,
                    text: '<button disabled>Goto: ' + g.name + '</button>'  //TODO button to view object           
                });        
                self.notice(g);
     });
}

function newProtogoalWidget(name) {
	var p = {
		'name': name
	};

	var d = newDiv();
	d.append(name);

	var b = $('<button title="Add">+</button>');
	b.click(function() {
		var g = newGoal(p);
		saveGoal(g);
	});
	d.append(b);
	return d;
}

function newProtogoalMenu() {
	var d = newDiv();
	function da(x) {
		d.append(newProtogoalWidget(x));
	}



	d.append('<h2>Personal Conditions</h2>');
	d.append('<b>Biometrics</b>');
	da('Age');
	da('Weight');
	da('Height');
	da('Gender');
	da('Temperature');
	da('Ethnicity');
	da('Blood type');
	da('Genetics');
	da('Pulse Rate & Variability');
	da('Blood Pressure');
	da('Breathing Rate');

	d.append('<br/>');
	d.append('<h2>Environment Conditions</h2>');
	d.append('<b>Weather</b>');
	da('Rain Storm');
	da('Snow');
	da('Tropical Storm');
	da('Hurricane');
	da('Tornado');
	da('Tsunami');
	da('Spaceweather');

	d.append('<br/>');
	var othergoalbutton = $('<button>Add Other Goal</button>');
	othergoalbutton.click(function() {
        //var targetTime = (time + endtime)/2.0;
		var targetTime = Date.now();
        var d = newPopup("Select Tags for Goal " + new Date(targetTime), {width: 800, height: 600, modal: true});
        d.append(newTagger([], function(results) {
			var nn = JSON.stringify(results);
			nn = nn.substring(1, nn.length-1);
			var pg = {
				name: nn,
				tags: results
			};
			var g = newGoal(pg);
			saveGoal(g);
		    d.dialog('close');      
        }));
		
	});
	d.append(othergoalbutton);

	return d;
}

