var ChatRoom = function(chatRoomDivId, eventBus, userService) {

    var _events = {
        ADD_USER : "addUser",
        FAIL_REGISTRATION: "failRegistration",
        SUCCESSFUL_REGISTRATION: "successfulRegistration",
        DISPLAY_USERS: "displayUsers"
    };

    userService.setEvents(_events);

    var root = document.getElementById(chatRoomDivId);
    var registrationBoxId = chatRoomDivId + "_registration";
    var userListBoxId = chatRoomDivId + "_userlist";

    root.innerHTML = '<div id="' + registrationBoxId + '"></div>'+
    '<div id="' + userListBoxId + '"></div>';

    var RegistrationComponent = function (registrationBoxId, eventBus) {

        var _initialize = function () {

            var registrationRoot = document.getElementById(registrationBoxId);

            var buttonId = registrationBoxId + "_button";

            var nicknameInputId = registrationBoxId + "_nickname";

            var passwordInputId = registrationBoxId + "_password";

            var confirmPasswordInputId = registrationBoxId + "_confirm_password";

            registrationRoot.innerHTML =  '<div id="' + registrationBoxId + "_content" + '" class="registration-box">'+
                'Nickname:<br>' +
                '<input type="text" name="nickname" id="' + nicknameInputId + '">' +
                '<br>' +
                'Password:<br>' +
                '<input type="password" name="password" id="' + passwordInputId + '">' +
                '<br>' +
                'Confirm password:<br>' +
                '<input type="password" name="confirmPassword" id="' + confirmPasswordInputId + '">' +
                '<br>' +
                '<div id = ' + registrationBoxId + "_message" + '></div><br>' +
                '<button id="' + buttonId + '">Register</button>'+
                '</div>';


            var button = document.getElementById(buttonId);

            button.onclick = function () {

                var nicknameInput = document.getElementById(nicknameInputId);
                var passwordInput = document.getElementById(passwordInputId);
                var confirmPasswordInput = document.getElementById(confirmPasswordInputId);

                var newUserData = {
                    newNickname: nicknameInput.value,
                    newUserPassword: passwordInput.value,
                    newUserConfirmationPassword: confirmPasswordInput.value
                };

                eventBus.post(_events.ADD_USER, newUserData);
                console.log("User's " + newUserData.newNickname + " data posted");
            }

        };

        var _displayRegistrationError = function (failRegistrationEvent) {
            var errorElementRootId = registrationBoxId + "_message";
            var errorElement = document.getElementById(errorElementRootId);
            errorElement.innerHTML = '<p style="color:red">' + failRegistrationEvent.message + '</p>'
        };

        var _displayRegistrationMessage = function (successfulRegistrationEvent) {
            var messageElementRootId = registrationBoxId + "_message";
            var messageElement = document.getElementById(messageElementRootId);
            messageElement.innerHTML = '<p style="color:green">' + successfulRegistrationEvent.message + '</p>'
        };


        return {"init": _initialize,
            "showError": _displayRegistrationError,
            "showMessage": _displayRegistrationMessage};
    };

    var UserListComponent = function (userListBoxId) {

        var _initialize = function (showUserListEvent) {

            var userListRoot = document.getElementById(userListBoxId);
            userListRoot.innerHTML = '<div id="' + userListBoxId + "_content" + '" class="userlist-box">'+
                '<h3>Registered users</h3>'+
                '<p id="'+userListBoxId+"_users"+'"></p>'+
                '</div>';

            if(typeof  showUserListEvent !== 'undefined') {
                var userList = showUserListEvent;
                var usersRoot = document.getElementById(userListBoxId+"_users");
                var users = "<br>";
                for (var i = 0; i < userList.length; i++) {
                    users += userList[i] + '<br>';
                }
                usersRoot.innerHTML = '<p>'+users+'<br></p>';
            }
        };

        return {"init": _initialize};
    };


    var registrationComponent = new RegistrationComponent(registrationBoxId, eventBus);
    var userListComponent = new UserListComponent(userListBoxId);

    registrationComponent.init();

    eventBus.subscribe(_events.ADD_USER, userService.addUser);
    eventBus.subscribe(_events.FAIL_REGISTRATION, registrationComponent.showError);
    eventBus.subscribe(_events.SUCCESSFUL_REGISTRATION, registrationComponent.showMessage);
    eventBus.subscribe(_events.DISPLAY_USERS, userListComponent.init);

};


define(function () {
    return ChatRoom;
});