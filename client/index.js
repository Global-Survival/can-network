/*!
 * index.js v1.2
 * Reconfigurated by @automenta and @rezn8d
 */

"use strict";

var MAX_INITIAL_OBJECTS = 1024;

function clearFocus() {
    later(function() {
        var u = uuid();
        Backbone.history.navigate('/object/' + u);
        self.set('list-semantic', 'Any');
        commitFocus(objNew(u));
    });
}

function focus() {
    return window.self.focus();
}

var renderedFocus;
function updateFocus() {

    renderedFocus = renderObject(focus(), true, focus, commitFocus);
    $('#Focus').html(renderedFocus);

}

function commitFocus(f) {
    window.self.set('focus', f);
    window.self.trigger('change:focus');
    updateFocus();
}

function updateTagTree() {
    var tt = $('#TypeSelectModalTree');

    updateTypeTree(tt, function(s) {

        var e = renderedFocus.getEditedFocus();
        for (var i = 0; i < s.length; i++) {
            var m = s[i];
            if (!objHasTag(e, m))
                e = objAddTag(e, m);
        }
        commitFocus(e);

    });
}

function saveObject(p) {
    p.author = self.id();
    objTouch(p);
    self.notice(p);
    self.pub(p);
    $.pnotify({
        title: 'Saved',
        text: p.uri
    });
}

function initDescriptionRichText() {
    $('#FocusDescriptionSection').html('<textarea id="FocusDescription"></textarea>');
    $('#FocusDescription').wysihtml5();
}

var updateView;


function initUI(self) {

    $('body').timeago();
    updateView = _.throttle(_updateView, 150);

    self.on('change:attention', function() {
        later(function() {
            updateView();
        });
    });

    self.on('change:currentView', function() {
        later(function() {
            updateView();
        });
    });

    self.on('change:tags', function() {

        later(function() {
            updateTagTree();
        });
    });


    $('#ViewMenu input').click(function(x) {
        var b = $(this);
        var v = b.attr('id');
        $('#ViewControls').buttonset('refresh');
        self.set('currentView', v);
        showAvatarMenu(false);
    });


    //TODO move this to focus.semantic.js when dynamically generating the focus UI
    $('#SaveButton').click(function() {
        var p = renderedFocus.getEditedFocus();
        later(function() {
            saveObject(p);
        });
    });
    $('#ClearButton').click(function() {
        clearFocus();
    });

    $('#AddDescriptionButton').click(function() {
        commitFocus(objAddValue(renderedFocus.getEditedFocus(), 'textarea', ''));
    });
    $('#AddLocationButton').click(function() {
        commitFocus(objAddValue(renderedFocus.getEditedFocus(), 'spacepoint', ''));
    });


    {

        var bar = $('.FocusUploadBar');
        var percent = $('.FocusUploadPercent');
        var status = $('#FocusUploadStatus');

        $('#FocusUploadForm').ajaxForm({
            beforeSend: function() {
                status.empty();
                var percentVal = '0%';
                bar.width(percentVal)
                percent.html(percentVal);
            },
            uploadProgress: function(event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                bar.width(percentVal)
                percent.html(percentVal);
            },
            complete: function(xhr) {
                var url = xhr.responseText;
                status.html($('<a>File uploaded</a>').attr('href', url));
                var ab = $('<button>Add Image To Description</button>');
                var absURL = url.substring(1);
                ab.click(function() {
                    var f = renderedFocus.getEditedFocus();
                    objAddDescription(f, '<a href="' + absURL + '"><img src="' + absURL + '"></img></a>');
                    commitFocus(f);
                });
                status.append('<br/>');
                status.append(ab);
            }
        });
    }


    var msgs = ['I think', 'I feel', 'I wonder', 'I know', 'I want'];
    //var msgs = ['Revolutionary', 'Extraordinary', 'Bodacious', 'Scrumptious', 'Delicious'];
    function updatePrompt() {
        var l = msgs[parseInt(Math.random() * msgs.length)];
        $('.nameInput').attr('placeholder', l + '...');
    }

    {
        setInterval(updatePrompt, 7000);
        updatePrompt();
    }

    updateTagTree();
}

var lastView = null;
var currentView = null;

function _updateView() {
    var s = window.self;

    $('.brand').html(s.myself().name);

    var avatarURL = getAvatarURL(s.myself().email);
    $('#AvatarButton img').attr('src', avatarURL);
    $('#toggle-menu').attr('src', avatarURL);

    s.saveLocal();

    var view = s.get('currentView');
    /*if (lastView==view)
     return;*/

    var o = $('#ViewOptions');
    var v = $('#View');


    if ((currentView) && (view === lastView)) {
        if (currentView.onChange) {
            currentView.onChange();
            return;
        }
    }

    v.html('');
    o.html('');

    lastView = view;

    v.removeClass('ui-widget-content');

    if (view === 'list') {
        v.addClass('overflow-scroll ui-widget-content');
        currentView = renderList(s, o, v);
    }
    else if (view === 'map') {
        v.addClass('overflow-hidden');
        currentView = renderMap(s, o, v);
    }
    else if (view === 'trends') {
        v.addClass('overflow-scroll ui-widget-content view-indented');
        currentView = renderTrends(s, o, v);
    }
    else if (view == 'graph') {
        v.addClass('overflow-hidden');
        currentView = renderGraphFocus(s, o, v);
    }
    else if (view == 'slides') {
        currentView = renderSlides(s, o, v);
    }
    else if (view == 'grid') {
        v.addClass('overflow-scroll ui-widget-content view-indented');
        currentView = renderGrid(s, o, v);
    }
    else if (view == 'self') {
        v.addClass('overflow-scroll ui-widget-content view-indented');
        currentView = renderSelf(s, o, v);
    }
    else if (view == 'options') {
        v.addClass('overflow-scroll ui-widget-content view-indented');
        currentView = renderOptions(s, o, v);
    }
    else {
        v.html('Unknown view: ' + view);
        currentView = null;
    }

}

function showEditedFocus() {
    $.pnotify({
        title: 'Current Focus (JSON)',
        text: (JSON.stringify(renderedFocus.getEditedFocus(), null, 4))
    });
}

function cloneFocus() {
    var y = getEditedFocus();
    var oldURI = y.id;
    y.id = uuid();
    y.author = window.self.id();
    commitFocus(y);
    saveObject(y);

    $.pnotify({
        title: 'Cloning...',
        text: oldURI + ' -> ' + y.id
    });
    return y;
}

function deleteFocus() {
    var f = window.self.focus();

    $.pnotify({
        title: 'Delete coming soon',
        text: f.uri
    });

}

function setTheme(t) {
    if (!t)
        t = 'bright';

    var oldTheme = window.self.get('theme');
    if (oldTheme !== t) {
        window.self.set('theme', t);
        window.self.saveLocal();
    }

    $('#themecss').remove();

    var themeURL;
    if (t[0] == '_') {
        t = t.substring(1);
        themeURL = 'theme/' + t + '.css';
    }
    else {
        themeURL = 'lib/jquery-ui/1.10.3/themes/' + t + '/jquery-ui.min.css';
    }
    $('head').append('<link id="themecss" href="' + themeURL + '" type="text/css" rel="stylesheet"/>');
}

function confirmClear() {
    if (confirm('Clear local memory?'))
        window.self.clear();
}

function showAvatarMenu(b) {
    var vm = $('#ViewMenu');
    if (!b) {
        $('#close-menu').hide();
        vm.fadeOut();
        $('#toggle-menu').show();
    }
    else {
        $('#toggle-menu').hide();
        vm.fadeIn();
        $('#close-menu').show();
    }
}


$(document).ready(function() {

    netention(function(self) {

        window.self = self;

        self.clear();

        $.getJSON('/schema/json', function(schema) {
            self.addProperties(schema['properties']);
            self.addTags(schema['tags']);


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
                    'new': function() {
                        clearFocus();
                    },
                    /*
                     newWithTags : function(ts) {                              
                     //'/new/with/tags/' + ts
                     ts = ts.split(',');
                     var tss = [];
                     for (var i = 0; i < ts.length; i++)
                     tss.push(1.0);
                     
                     commitFocus({
                     id: uuid(),
                     tag: ts,
                     tagStrength: tss
                     });
                     },*/

                    me: function() {
                        commitFocus(self.myself());
                    },
                    completeExample: function() {
                        commitFocus(exampleObject);
                    },
                    /*
                     help: function() {
                     commitFocus({
                     uri: uuid(),
                     tag: [ 'help '], tagStrength: [ 1.0 ]
                     });
                     },*/

                    tag: function(tag) {
                        self.set('list-semantic', 'Relevant');
                        commitFocus(objAddTag(objNew(), tag));
                    },
                    query: function(query) {
                        commitFocus({
                            id: uuid(),
                            name: query
                        });
                    },
                    object: function(id) {
                        var x = self.getObject(id);
                        if (x) {
                            newPopupObjectView(x);
                        }
                        else {
                            $.pnotify({
                                title: 'Unknown object',
                                text: id.substring(0, 4) + '...'
                            });
                        }
                    },
                    focus: function(id) {
                        self.set('list-semantic', 'Relevant');
                        commitFocus(self.getObject(id));
                        updateView();

                    }

                });


                setTheme(self.get('theme'));


                initUI(self);

                var w = new Workspace();
                Backbone.history.start();


                if (!self.get('currentView')) {
                    self.set('currentView', 'grid');
                }
                else {
                    updateView();
                }

                //select the current view in the ViewControls
                $('#ViewControls #' + self.get('currentView')).attr('checked', true);
                $('#ViewControls').buttonset('refresh');


                //updateFocus();
                if (!self.focus())
                    clearFocus();
                else
                    updateFocus();
            });
        });


    });

    $('#toggle-menu').click(function() {
        var vm = $('#ViewMenu');
        var shown = vm.is(':visible');
        showAvatarMenu(!shown);
    });
    $('.close-menu').click(function() {
        var vm = $('#ViewMenu');
        var shown = vm.is(':visible');
        showAvatarMenu(!shown);
    });
    $('.avatar-active').click(function() {
        showAvatarMenu(false);
    });




    $('#close-menu').button();
    $('#FocusEdit button').button();
    $("#ViewControls").buttonset();


    /* THIS NEEDS EDIT TO CONTROLS LAYERS, NOT IFRAME EMBED */
    $("#layer-tree").jstree({"plugins": ["html_data", "ui", "themeroller"]});

    $("#layer-tree").delegate("a", "click", function(e) {
        if ($(e.currentTarget).blur().attr('href').match('^#$')) {
            $("#layer-tree").jstree("open_node", this);
            return false;
        } else {
            var embedLocation = (this).href;
            $('#View').html('');
            $('#View').html('<iframe src="' + embedLocation + '" frameBorder="0" id="embed-frame"></iframe>');
            $("#View").removeClass("ui-widget-content");
            var vm = $('#ViewMenu');
            var shown = vm.is(':visible');
            showAvatarMenu(!shown);
            e.preventDefault();
            return false;
        }
    });

    $("#expand-layer-tree").click(function() {
        $("#layer-tree").jstree("open_all");
    });

    $("#close-layer-tree").click(function() {
        $("#layer-tree").jstree("close_all");
    });

    /* IFRAME EMBED */

    $("#url-tree").jstree({"plugins": ["html_data", "ui", "themeroller"]});

    $("#url-tree").delegate("a", "click", function(e) {
        if ($(e.currentTarget).blur().attr('href').match('^#$')) {
            $("#url-tree").jstree("open_node", this);
            return false;
        } else {

            var embedLocation = (this).href;
            $('#View').html('');
            $('#View').html('<iframe src="' + embedLocation + '" frameBorder="0" id="embed-frame"></iframe>');
            $("#View").removeClass("ui-widget-content");
            var vm = $('#ViewMenu');

            var shown = vm.is(':visible');
            showAvatarMenu(!shown);
            e.preventDefault();
            return false;
        }
    });

    $("#expand-url-tree").click(function() {
        $("#url-tree").jstree("open_all");
    });

    $("#close-url-tree").click(function() {
        $("#url-tree").jstree("close_all");
    });


    $('.ext-link').click(function() {
        var linkLocation = (this).value;
        $('#View').html('');
        $('#View').html('<iframe src="' + linkLocation + '" frameBorder="0" id="embed-frame"></iframe>');
        var vm = $('#ViewMenu');
        var shown = vm.is(':visible');
        showAvatarMenu(!shown);
    });



});


