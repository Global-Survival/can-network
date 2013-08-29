//

function newGoalWidget(g)  {
	return JSON.stringify(g);
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

