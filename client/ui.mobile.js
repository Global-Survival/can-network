function showAvatarMenu(b) {
    var vm = $('#ViewMenu');
    if (!b) {
        $('#close-menu').hide();
        $('#AvatarButton').hide();
        vm.fadeOut();
        $('#toggle-menu').show();
    }
    else {
        $('#toggle-menu').hide();
        vm.fadeIn();
        $('#close-menu').show();
        $('#AvatarButton').show();
        vm.show();
    }
}

$('#SelectProfileButton').click(function() {
    var d = newPopup('Profiles', {width: '450px'});
    d.append(newProfileWidget());
});

$('#ViewMenu input').click(function(x) {
    var b = $(this);
    var v = b.attr('id');
    if ((b.attr('type') === 'text') || (b.attr('type') === 'checkbox'))
        return;
    $('#ViewControls').buttonset('refresh');
    self.save('currentView', v);
    showAvatarMenu(false);
});

$('#toggle-menu').click(function() {
    var vm = $('#ViewMenu');
    var shown = vm.is(':visible');
    showAvatarMenu(!shown);
});
$('#close-menu').click(function() {
    var vm = $('#ViewMenu');
    var shown = vm.is(':visible');
    showAvatarMenu(!shown);
});
$('#AvatarButton').click(function() {
    showAvatarMenu(false);
});


$('#AddContentButton').click(function() {
    newPopup('Add...', {}).append(newObjectEdit(objNew(), true));
    //showAvatarMenu(false);        
});

$('#FocusButton').click(function() {
    /*
     <div id="Layer" class="ui-widget-header overthrow">
     </div>
     <span>
     <input type="text" placeholder="Filter" disabled/>
     <input type="checkbox" id="GeographicToggle">Exclude Un-Mappable</input>
     </span>                                                        
     */
});

if (configuration.initialDisplayAvatarMenu)
    showAvatarMenu(true);
else
    showAvatarMenu(false);
