var updatePeriod = 30 * 1000; //in ms

function newGoalWidget(g)  {

	var d = newDiv();

	d.attr('class', 'GoalSummary ui-widget-content');

	var aa = $('<a href="#"><h2>' + g.name + '</h2></a>');
	d.append(aa);
	aa.click(function() {
		newPopupObjectView(g);
	});

	d.attr('style', 'font-size: ' + (100.0 * (0.25 + g.strength) )+ '%');

	//display author avatar

	//display ETA - estimated time to activation

	var dismissButton = $('<button title="Dismiss">OK</button>');
	d.append(dismissButton);

	return d;
}

function renderGoal(v) {
	var sidebar = newDiv('goalviewSidebar');
	var goalList = newDiv('goalviewList');

	sidebar.html(newProtogoalMenu());

	v.append(sidebar);
	v.append(goalList);


	var now = true;
	var goalTime = Date.now();

	function updateGoalList() {
		goalList.html('');

		if (now)
			goalTime = Date.now();

		var nowButton = $('<button>Now</button>');
		nowButton.click(function() {
			now = true;
			updateGoalList();
		});
		goalList.append(nowButton);

		var st = newSelfTimeGrid(self.myself(), function(clickedTime) {
			goalTime = clickedTime;
			now = false;
			updateGoalList();
		});

		goalList.append(st);

		goalList.append('<br/>');
		goalList.append('<hr/>');
		goalList.append('NOW: ' + new Date(goalTime));

		var goals = self.getGoals(goalTime);
		for (var i = 0; i < goals.length; i++) {
			goalList.append(newGoalWidget(goals[i]));
		}
	}
	setInterval(updateGoalList, updatePeriod);
	updateGoalList();

}

function newSelfTimeGrid(x, clicked) {
    var s = self;
    var plan = x.plan;
    if (!plan)
        plan = { };
    
    var numHours = 24;

    function save() {
        if (x.id !== s.myself().id)
            return;
        plan = { };
        for (var i = 0; i < numHours; i++) {
            var tt = planSlotTimes[i];
            if (planSlots[i].length > 0)
                plan[tt] = planSlots[i];
            
        }
        
        later(function() {
            saveSelf(function(m) {
               m.plan = plan; 
               return m;
            });
        });
        /*s.notice(me);
        s.pub(me, function(err) {
            $.pnotify({
               title: 'Unable to save Self.',
               type: 'Error',
               text: err
            });           
        }, function() {
            $.pnotify({
               title: 'Self Saved.'            
            });           
        });*/
    }
    
    var planTimes = _.keys(plan);
    
    var time = new Date();
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time = time.getTime();
    
    var d = newDiv();
    d.attr('style', 'width:100%; overflow: auto;');

    var planSlotTimes = { };
    var planSlots = { };
    
    var centroidTimes = self.objectsWithTag('PlanCentroid');
    if (!centroidTimes) centroidTimes = [];
    
    for (var i = 0; i < numHours; i++) {
        var cell = $('<a>');
		cell.addClass('timecell');

		//http://css-tricks.com/how-to-create-a-horizontally-scrolling-site/
		var fs = 100.0 * (0.25 + (numHours-i)/numHours);
		cell.attr('style', 'display: inline-block;');

        var endtime = time + 60.0 * 60.0 * 1000.0 * 1.0;
        var timed = new Date(time);
        var rowHeader = newDiv();

		/*
        if (i % 12 == 0) {
            rowHeader.html(timed.toLocaleDateString() + ': ' + timed.toLocaleTimeString());            
        }
        else {
            rowHeader.html(timed.toLocaleTimeString());                        
        }*/
		var lds = timed.toLocaleDateString()
		cell.attr('title', timed.toLocaleDateString() + ': ' + timed.toLocaleTimeString());
		rowHeader.html(timed.toLocaleTimeString().substring(0, 2));
        
        var t = newDiv();        
        var u = newDiv();
        
        
        var plans = [];
        var centroids = [];
        for (var k = 0; k < centroidTimes.length; k++) {
            var pp = centroidTimes[k];
            var ppo = self.object(pp);
            var ppw = objWhen(ppo);
            if ((ppw >= time) && (ppw < endtime))
                centroids.push(ppo);
        }
        
        for (var k = 0; k < planTimes.length; k++) {
            var pp = planTimes[k];
            if ((pp >= time) && (pp < endtime))
                plans = plans.concat(plan[pp]);
        }
        planSlotTimes[i] = time;
        planSlots[i] = _.unique(plans);
        
        t.append('&nbsp;');
        _.each(plans, function(p) {
            t.append(newTagButton(p));
            t.append('&nbsp;');
        });
        
        _.each(centroids, function(c) {
            u.append(newObjectSummary(c));
        });
        
        if (plans.length > 0)
            t.addClass('SelfTimeFilled');

        (function(i, time, endtime) {
            cell.click(function() {
                var targetTime = (time + endtime)/2.0;
				clicked(time);
				/*
                var targetTime = (time + endtime)/2.0;
                var d = newPopup("Select Tags for " + new Date(targetTime), {width: 800, height: 600, modal: true});
                d.append(newTagger(planSlots[i], function(results) {
                    planSlots[i] = results;
                    later(function() {
                        save();                    
                        d.dialog('close');                        
                    });
                    //container.html(newSelfTimeList(s, x, container));
                }));
				*/
            });
        })(i, time, endtime);
        
		cell.append(rowHeader);
        cell.append(t);
        cell.append(u);
        d.append(cell);
        time = endtime;
    }
    
    return d;
}


//OLD, becoming deprecated:
function newSelfTimeList(x, container) {

    var s = self;
    var plan = x.plan;
    if (!plan)
        plan = { };
    
    var numHours = 72;

    function save() {
        if (x.id !== s.myself().id)
            return;
        plan = { };
        for (var i = 0; i < numHours; i++) {
            var tt = planSlotTimes[i];
            if (planSlots[i].length > 0)
                plan[tt] = planSlots[i];
            
        }
        container.html(newSelfTimeList(self.myself(),container));
        
        later(function() {
            saveSelf(function(m) {
               m.plan = plan; 
               return m;
            });
        });
        /*s.notice(me);
        s.pub(me, function(err) {
            $.pnotify({
               title: 'Unable to save Self.',
               type: 'Error',
               text: err
            });           
        }, function() {
            $.pnotify({
               title: 'Self Saved.'            
            });           
        });*/
    }
    
    var planTimes = _.keys(plan);
    
    var time = new Date();
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time = time.getTime();
    
    var d = newDiv();
    
    var planSlotTimes = { };
    var planSlots = { };
    
    var centroidTimes = self.objectsWithTag('PlanCentroid');
    if (!centroidTimes) centroidTimes = [];
    
    for (var i = 0; i < numHours; i++) {
        var endtime = time + 60.0 * 60.0 * 1000.0 * 1.0;
        var timed = new Date(time);
        var rowHeader = newDiv();
        rowHeader.addClass('SelfTimeRowHeader');
        
        if (i % 12 == 0) {
            rowHeader.html(timed.toLocaleDateString() + ': ' + timed.toLocaleTimeString());            
        }
        else {
            rowHeader.html(timed.toLocaleTimeString());                        
        }
        
        var t = newDiv();
        t.addClass('SelfTimeWantToPeriod');
        
        var u = newDiv();
        u.addClass('SelfTimeCouldDoPeriod');
        
        
        var plans = [];
        var centroids = [];
        for (var k = 0; k < centroidTimes.length; k++) {
            var pp = centroidTimes[k];
            var ppo = self.object(pp);
            var ppw = objWhen(ppo);
            if ((ppw >= time) && (ppw < endtime))
                centroids.push(ppo);
        }
        
        for (var k = 0; k < planTimes.length; k++) {
            var pp = planTimes[k];
            if ((pp >= time) && (pp < endtime))
                plans = plans.concat(plan[pp]);
        }
        planSlotTimes[i] = time;
        planSlots[i] = _.unique(plans);
        
        t.append('&nbsp;');
        _.each(plans, function(p) {
            t.append(newTagButton(p));
            t.append('&nbsp;');
        });
        
        _.each(centroids, function(c) {
            u.append(newObjectSummary(c));
        });
        
        if (plans.length > 0)
            t.addClass('SelfTimeFilled');

		if (s.myself()) {
		    if (x.id === s.myself().id) { //only edit own plan
		        (function(i, time, endtime) {
		            t.click(function() {
		                var targetTime = (time + endtime)/2.0;
		                var d = newPopup("Select Tags for " + new Date(targetTime), {width: 800, height: 600, modal: true});
		                d.append(newTagger(planSlots[i], function(results) {
		                    planSlots[i] = results;
		                    later(function() {
		                        save();                    
		                        d.dialog('close');                        
		                    });
		                    //container.html(newSelfTimeList(s, x, container));
		                }));
		            });
		        })(i, time, endtime);
		    }
		}

        d.append(rowHeader);
        d.append(t);
        d.append(u);
        time = endtime;
    }
    
    return d;
}
