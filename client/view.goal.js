//

function newGoalWidget(g)  {

	var d = newDiv();
	d.attr('class', 'GoalSummary');
	d.append('<h2>' + g.name + '</h2>');
	d.attr('style', 'font-size: ' + (100.0 * (1.0 + g.strength) )+ '%');

	//display author avatar

	//display ETA - estimated time to activation

	var dismissButton = $('<button title="Dismiss">X</button>');
	d.append(dismissButton);

	return d;
}

function renderGoal(v) {
	var sidebar = newDiv('goalviewSidebar');
	var goalList = newDiv('goalviewList');

	$.get('/inputs.html', function(x) {
		sidebar.html(x);
	});

	v.append(sidebar);
	v.append(goalList);

	var updatePeriod = 2000 * 1000; //in ms
	function updateGoalList() {
		goalList.html('');
		var goals = self.getGoals(Date.now());
		for (var i = 0; i < goals.length; i++) {
			goalList.append(newGoalWidget(goals[i]));
		}
	}
	setInterval(updateGoalList, updatePeriod);
	updateGoalList();

}

