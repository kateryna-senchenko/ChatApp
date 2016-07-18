var ChatRoom = function (chatRoomDivId, eventBus, userRegistrationEvents, userService) {


    var registrationBoxId = chatRoomDivId + "_registration";
    var userListBoxId = chatRoomDivId + "_userlist";

    $("#" + chatRoomDivId).append($('<div/>').attr("id", registrationBoxId))
                          .append($('<div/>').attr("id", userListBoxId));


    var RegistrationComponent = function (registrationBoxId, eventBus) {

        var _initialize = function () {

            var contentId = registrationBoxId + "_content";
            $("#" + registrationBoxId).html($('<div/>').attr("id", contentId));

            var buttonId = registrationBoxId + "_button";
            var nicknameInputId = registrationBoxId + "_nickname";
            var passwordInputId = registrationBoxId + "_password";
            var confirmPasswordInputId = registrationBoxId + "_confirm_password";
            var registrationMessageId = registrationBoxId + "_message";

            $("#" + contentId).append($('<label/>').text("Nickname")).append($('<br/>'))
                              .append($('<input/>').attr("id", nicknameInputId).attr("type", "text"))
                              .append($('<br/>'))
                              .append($('<label/>').text("Password")).append($('<br/>'))
                              .append($('<input/>').attr("id", passwordInputId).attr("type", "password"))
                              .append($('<br/>'))
                              .append($('<label/>').text("Confirm Password")).append('<br/>')
                              .append($('<input/>').attr("id", confirmPasswordInputId).attr("type", "password"))
                              .append($('<br/>'))
                              .append($('<div/>').attr("id", registrationMessageId)).append($('<br/>'))
                              .append($('<button/>').attr("id", buttonId).text('Register'));


            $("#"+buttonId).click(function () {

                var newUserData = {
                    newNickname: $("#" + nicknameInputId).val(),
                    newUserPassword: $("#" + passwordInputId).val(),
                    newUserConfirmationPassword: $("#" + confirmPasswordInputId).val()
                };

                eventBus.post(userRegistrationEvents.events.USER_IS_ADDED, newUserData);
                console.log("User's " + newUserData.newNickname + " data posted");
            });
        };

        var _displayRegistrationError = function (failRegistrationEvent) {

            var errorElementRootId = registrationBoxId + "_message";
            $("#" + errorElementRootId).html($('<p/>').attr("style", "color:red")
                                                      .text(failRegistrationEvent.message));
        };

        var _displayRegistrationMessage = function (successfulRegistrationEvent) {

            var messageElementRootId = registrationBoxId + "_message";
            $("#" + messageElementRootId).html($('<p/>').attr("style", "color:green")
                .text(successfulRegistrationEvent.message));

        };


        return {
            "init": _initialize,
            "showRegistrationError": _displayRegistrationError,
            "showSuccessfulRegistrationMessage": _displayRegistrationMessage
        };
    };

    var UserListComponent = function (userListBoxId) {

        var _initialize = function (showUserListEvent) {

            var contentId = userListBoxId + "_content";
            $("#" + userListBoxId).html($('<div/>').attr("id", contentId));

            $("#" + contentId).append($('<h3/>').text("Registered users"));


            if (typeof  showUserListEvent !== 'undefined') {

                var userList = showUserListEvent;

                for (var i = 0; i < userList.length; i++) {
                    $("#" + contentId).append($('<li/>').text(userList[i]));

                }
            }
        };

        return {"init": _initialize};
    };


    var registrationComponent = new RegistrationComponent(registrationBoxId, eventBus);
    var userListComponent = new UserListComponent(userListBoxId);

    registrationComponent.init();

    eventBus.subscribe(userRegistrationEvents.events.USER_IS_ADDED, userService.addUser);
    eventBus.subscribe(userRegistrationEvents.events.REGISTRATION_FAILED, registrationComponent.showRegistrationError);
    eventBus.subscribe(userRegistrationEvents.events.REGISTRATION_IS_SUCCESSFUL, registrationComponent.showSuccessfulRegistrationMessage);
    eventBus.subscribe(userRegistrationEvents.events.USERS_UPDATED, userListComponent.init);

};


define(function () {
    return ChatRoom;
});
