function newProfileWidget() {
    var d = newDiv();
    function closeDialog() {
        d.parent().dialog('close');            
    }

    function become(u) {
        self.become(u);             
    }

    var selector = $('<select/>');
    var okButton = $('<button><b>Become</b></button>');
    var deleteButton = $('<button>Delete</button>');

    var otherSelves = self.get('otherSelves');
    if (!otherSelves) {
        selector.append('<option>' + self.myself().name + '</option>');
        selector.attr('disabled', 'disabled');
        okButton.attr('disabled', 'disabled');
        deleteButton.attr('disabled', 'disabled');
    }
    else {
        for (var i = 0; i < otherSelves.length; i++) {
            var s = otherSelves[i];
            if (s.indexOf('Self-')==0)
                s = s.substring(5);
            var o = self.getSelf(s);
            if (o) {                    
                var n = o.name;
                var selString = (o.id.substring(5) === self.id()) ? 'selected' : '';
                selector.append('<option value="' + s + '" ' + selString + '>' + n + '</option>');
            }
            else {
                //console.log('unknown self: ' + s);
            }

        }
    }

    d.append(selector);

    d.append(okButton);
    okButton.click(function() {
        var id = selector.val();
        become(self.getSelf(id));
        closeDialog();
    });

    d.append(deleteButton);
    deleteButton.click(function() {
        if (confirm('Permanently delete?')) {
            self.deleteSelf(selector.val());
            closeDialog();
        }
    });


    d.append('<hr/>');

    var newButton = $('<button>New Profile...</button>');
    newButton.click(function() {
        var name = prompt("New Profile Name", "Anonymous");
        if (name) {
            var u = uuid();
            var uo = 'Self-' + u;
            var o = objNew(uo, name);
            objAddTag(o, 'Human');
            objAddTag(o, 'User');            
            become(o);
            closeDialog();
        }
    });
    d.append(newButton);        
    return d;
}
