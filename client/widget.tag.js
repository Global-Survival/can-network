function newTagChooserWidget(selected, onFinished) {
    //tagview select div
    //  wiki, tree, favorites, search, emotion, body, etc..
    //tag view (most of height)
    //collected tags (buttons with close 'x') + save button
    
    if (!selected)
        selected = [];
    
    var d = newDiv();
    var t = newDiv(); //target for the browser instances
    var currentBrowser = null;
    
    var tags = selected;
    
    var tagsCombo = $('<select></select>');
    tagsCombo.update = function() {
        tagsCombo.html('');
        for (var i = 0; i < tags.length; i++)
            tagsCombo.append('<option>' + tags[i] + '</option>');
    };
     
    function onTagAdded(t) {
        tags.push(t);
        tagsCombo.update();
    }
    
    function loadBrowser(w) {
        t.html('');
        currentBrowser = w(selected, onTagAdded);
        t.append(currentBrowser);        
    }
    
    var selectBar = newDiv();
    selectBar.attr('style', 'width: 50%; float: left;');
    {
        var b1 = $('<button>Wiki</button>');
        b1.click(function() { loadBrowser(newWikiBrowser); });
        selectBar.append(b1);
        var b2 = $('<button>Tree</button>');
        b2.click(function() { loadBrowser(newTreeBrowser); });
        selectBar.append(b2);
        var b3 = $('<button disabled>Who</button>');
        selectBar.append(b3);
        var b4 = $('<button disabled>Emotion</button>');
        selectBar.append(b4);
        var b5 = $('<button disabled>Body</button>');
        selectBar.append(b5);
    }
    d.append(selectBar);
    
    var saveBar = newDiv();
    saveBar.attr('style', 'width: 50%; float: right; text-align: right');
    {
        tagsCombo.update();
        saveBar.append(tagsCombo);
        
        saveBar.append('<button disabled>x</button>');
        
        var b = $('<button><b>OK</b></button>');
        b.click(function() {
            onFinished(tags);
            /*
            var newTags = [];
            $('.TagChoice').each(function(x) {
                var t = $(this);
                var tag = t.attr('id');
                if (t.is(':checked'))
                    newTags.push(tag);
            });
            onFinished(newTags);*/
            
        });
        saveBar.append(b);
    }
    d.append(saveBar);
        
    t.attr('style', 'clear: both');
    d.append(t);
    
    //default
    loadBrowser(newTreeBrowser);
    
    
    return d;
}

function newTreeBrowser(selected, onTagAdded) {
    var e = newDiv();
    e.addClass('SelfTimeTagTree');
    
    $('.TagChoice').remove();
    
    var p = {
        target: e,
        newTagDiv: function(id, content) {
            var ti = getTagIcon(id);
            if (ti)
                content = '<img style="height: 1em" src="' + ti + '"/>' + content;
            return {
                label: ('<input id="' + id + '" class="TagChoice" type="checkbox" ' + (_.contains(selected, id) ? 'selected' : '') + '>' + content + '</input>')
            };
        }        
    };
    newTagTree(p);    
    
    return e;
    
}

function newWikiBrowser(selected, onTagAdded) {
    console.log('onTagAdded', onTagAdded);
    
    var b = $('<div/>');
    
    
    var backButton = $('<button disabled>Back</button>');
    var homeButton = $('<button>Bookmarks</button>');
    homeButton.click(function() {
       gotoTag(configuration.wikiStartPage);
    });
    var searchInput = $('<input placeholder="Search Wikipedia"/>');
    var searchInputButton = $('<button>&gt;&gt;&gt;</button>');
    searchInputButton.click(function() {
       gotoTag(searchInput.val(), true); 
    });
    b.append(backButton);
    b.append(homeButton);
    b.append('<button title="Bookmark">*</button>');
    b.append(searchInput);
    b.append(searchInputButton);
    
    var br = $('<div/>');
    br.addClass('WikiBrowser');
    
        
    var currentTag = configuration.wikiStartPage;
    
    function gotoTag(t,search) {        
        br.html('Loading...');
        currentTag = t;
        
        /*if (t == null) {
            $.get('/skill-home.html', function(d) {
               br.html('');
               br.append(d); 
s
            });
            
            }
            else */
        {
            var url = search ? '/wiki/search/' + t : '/wiki/' + t + '/html';

            function newPopupButton(target) {
                var p = $('<a href="#" title="Tag">+</a>');
                p.click(function() {
                    if (onTagAdded)
                        onTagAdded(target);
                });
                return p;
            }
            
            $.get(url, function(d) {
               br.html('');
               br.append(d); 
               
               if (search) {
                    currentTag = $('.WIKIPAGEREDIRECTOR').html();
               }
               
               br.find('#top').remove();
               br.find('#siteSub').remove();
               br.find('#contentSub').remove();
               br.find('#jump-to-nav').remove();
               br.find('a').each(function(){
                   var t = $(this);
                   var h = t.attr('href');
                   t.attr('href', '#');
                   if (h) {
                    if (h.indexOf('/wiki') == 0) {
                        var target = h.substring(6);
                        
                        t.click(function() {
                             gotoTag(target); 
                        });
                         
                        if ((target.indexOf('Portal:')!=0) && (target.indexOf('Special:')!=0)) {
                            t.after(newPopupButton(target));
                        }
                    }
                   }
               });
               var lt = newPopupButton(currentTag);
               
               if (currentTag.indexOf('Portal:')!=0)
                    br.find('#firstHeading').append(lt);
            });
            
            //..
        }
    }
    gotoTag(currentTag);
        
    b.append(br);
    
    
    /*{
        var tagBar = newTagBar(s, currentTag);
        var saveButton = newTagBarSaveButton(s, currentTag, tagBar);
        
        b.append(saveButton);        
        b.prepend(tagBar);
    }*/
    
    return b;    
}