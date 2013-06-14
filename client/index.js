/*!
 * index.js
 */

"use strict";

var MAX_INITIAL_OBJECTS = 1024;

var updateView;

function initUI() {

    $('body').timeago();
    updateView = _.throttle(_updateView, 650);

    function doUpdate() {
        later(function() {
            updateView();
        });        
    }
    
    self.on('change:attention', doUpdate);    
    self.on('change:layer', doUpdate);
    self.on('change:currentView', doUpdate);
    self.on('change:tags', doUpdate);
 
 

    var msgs = ['I think', 'I feel', 'I wonder', 'I know', 'I want'];
    //var msgs = ['Revolutionary', 'Extraordinary', 'Bodacious', 'Scrumptious', 'Delicious'];
    function updatePrompt() {
        var l = msgs[parseInt(Math.random() * msgs.length)];
        $('.nameInput').attr('placeholder', l + '...');
    }
    setInterval(updatePrompt, 7000);
    updatePrompt();
        
    $.getScript('theme.mobile.js', function(data) {
        doUpdate();
    });
}

var lastView = null;
var currentView = null;

function updateBrand() {
    if (!self.myself())
        return;
    
    $('.brand').html(self.myself().name);

    var avatarURL = getAvatarURL(self.myself().email);
    $('#avatar-img').attr('src', avatarURL);
    $('#toggle-img').attr('src', avatarURL);    
}

function _updateView(force) {
    var s = window.self;

    updateBrand();

    //s.saveLocal();

    var view = s.get('currentView');

    var o = $('#ViewOptions');
    var v = $('#View');
    if (v.is(':visible')) {    }
    else
        return;

    if (!force) {
        if ((currentView) && (view === lastView)) {
            if (currentView.onChange) {
                currentView.onChange();
                return;
            }
        }
    }

    v.html('');
    o.html('');

    lastView = view;

    v.removeClass('ui-widget-content');
    v.removeClass('view-indented');
    v.removeClass('overthrow');
    v.removeClass('overflow-hidden');
    v.removeClass('nobg');
    
    if (view === 'list') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderList(s, o, v);
    }
    else if (view === 'map') {
        v.addClass('overflow-hidden');
        v.addClass('nobg');
        currentView = renderMap(s, o, v);
    }
    else if (view === 'trends') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderTrends(s, o, v);
    }
    else if (view == 'graph') {
        v.addClass('overflow-hidden');
        currentView = renderGraphFocus(s, o, v);
    }
/*    else if (view == 'slides') {
        currentView = renderSlides(s, o, v);
    }*/
    else if (view == 'grid') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderGrid(s, o, v);
    }
    else if (view == 'self') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderSelf(s, o, v);
    }
    else if (view == 'plan') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderPlan(v);
    }
    else if (view == 'options') {
        v.addClass('overthrow ui-widget-content view-indented');
        currentView = renderOptions(s, o, v);
    }
    else {
        v.html('Unknown view: ' + view);
        currentView = null;
    }

}




function setTheme(t) {
    if (!t)
        t = configuration.defaultTheme;    
    if (!_.contains(_.keys(themes), t))
        t = configuration.defaultTheme;

    var oldTheme = window.self.get('theme');
    if (oldTheme !== t) {
        window.self.set('theme', t);
        window.self.saveLocal();
    }

    $('.themecss').remove();

    var themeURL;
    var inverse = false;
    if (t[0] == '_') {
        t = t.substring(1);
        themeURL = 'theme/' + t + '.css';
        if (t === 'Dark') inverse = true;
    }
    else {
        themeURL = 'lib/jquery-ui/1.10.3/themes/' + t + '/jquery-ui.min.css';
        if (t === 'ui-darkness') inverse = true;
    }
    
    $('head').append('<link class="themecss" href="' + themeURL + '" type="text/css" rel="stylesheet"/>');
    if (inverse) {
        $('head').append('<link class="themecss" href="/theme/black-background.css" type="text/css" rel="stylesheet"/>');
    }
    
}



function popupAboutDialog() {
    $.get('/about.html', function(d) {
        var p = newPopup('About'); 
        p.html(d);
    });
}

$(document).ready(function() {
	
    if (configuration.enableAnonymous)
        $('#AnonymousLoginButton').show();
        
    if (!isAuthenticated()) {        
        return;
    }
    
    $('#LoadingSplash').hide();
    
    netention(function(self) {

        window.self = self;
        
        setTheme(self.get('theme'));

        self.clear();

        self.loadSchemaJSON('/schema/json', function() {            

            self.getLatestObjects(MAX_INITIAL_OBJECTS, function() {

                self.listenAll(true);

                //SETUP ROUTER
                var Workspace = Backbone.Router.extend({
                    routes: {
                        "new": "new",
                        "me": "me", // #help
                        "help": "help", // #help
                        "query/:query": "query", // #search/kiwis
                        "object/:id": "object",
                        "object/:id/focus": "focus",
                        "tag/:tag": "tag",
                        //"new/with/tags/:t":     "newWithTags",
                        "example": "completeExample"
                                //"search/:query/:page":  "query"   // #search/kiwis/p7
                    },

                    me: function() {
                        commitFocus(self.myself());
                    },
                    completeExample: function() {
                        commitFocus(exampleObject);
                    },
                    showObject: function(id) {
                        var x = self.getObject(id);
                        if (x) {
                            newPopupObjectView(x);
                        }
                        else {
                            /*$.pnotify({
                                title: 'Unknown object',
                                text: id.substring(0, 4) + '...'
                            });*/
                        }
                    }

                });

                var w = new Workspace();
                Backbone.history.start();

                if (configuration.initialView) {
                    self.set('currentView', configuration.initialView);
                }

                //select the current view in the ViewControls
                $('#ViewControls #' + self.get('currentView')).attr('checked', true);
                $('#ViewControls').buttonset('refresh');
                
                initUI();
                
                $('#View').show();
                $('#LoadingSplash2').hide();                
                /*if (isAuthenticated()) {
                          $.pnotify({
                            title: 'Authorized',
                            text: self.myself().name
                         });
                        }*/
                
            });
        });


    });



    $('#logout').hover(
		function() { $(this).addClass('ui-state-hover');$(this).addClass('shadow'); },
		function() { $(this).removeClass('ui-state-hover');$(this).removeClass('shadow'); }
	);

    if (isAuthenticated()) {
        $('.logout').show();
        $('.login').hide();
    }
    else {
        $('.logout').hide();
        $('.login').show();        
    }

    $('#close-menu').button();
    $("#ViewControls").buttonset();
    

});

$(document).ready(function() {
	
	$('#about-toggle').click(function() {
		$('#about-netention').fadeIn();
	});
	$('#openid-toggle').click(function() {
		$('#openid-login').fadeIn();
	});

});