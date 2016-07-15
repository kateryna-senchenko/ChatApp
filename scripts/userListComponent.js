var UserListComponent = function (_rootDivId) {

    var _initialize = function (showUserListEvent) {
        var userListBoxId = _rootDivId + "_box";
        var root = document.getElementById(_rootDivId);
        root.innerHTML =
            '<div id="' + userListBoxId + '" class="userlist-box"></div>';
        var userListBoxComponent = new UserListBoxComponent(userListBoxId);
        userListBoxComponent.initBox(showUserListEvent);

    };


    var UserListBoxComponent = function (_boxDivId) {

        var _initBox = function (showUserListEvent) {

            var boxRoot = document.getElementById(_boxDivId);

            boxRoot.innerHTML = '<h3>Registered users</h3>'+
                        '<p>' + showUserListEvent + '</p>';

        }
        return {"initBox": _initBox};
    }

    return {"init": _initialize};
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    return UserListComponent;
});

