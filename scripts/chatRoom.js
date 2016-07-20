var ChatRoom = function (chatRoomDivId, eventbus, events, userService, chatService) {


    var registrationBoxId = chatRoomDivId + "_registration";
    var userListBoxId = chatRoomDivId + "_userlist";
    var loginBoxId = chatRoomDivId + "_login";


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


            $("#" + buttonId).click(function () {

                var newUserData = {
                    newNickname: $("#" + nicknameInputId).val(),
                    newUserPassword: $("#" + passwordInputId).val(),
                    newUserConfirmationPassword: $("#" + confirmPasswordInputId).val()
                };

                console.log("User's " + newUserData.newNickname + " data posting");
                eventbus.post(events.USER_IS_ADDED, newUserData);

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

            var nicknameInputId = registrationBoxId + "_nickname";
            var passwordInputId = registrationBoxId + "_password";
            var confirmPasswordInputId = registrationBoxId + "_confirm_password";
            $("#" + nicknameInputId).val("");
            $("#" + passwordInputId).val("");
            $("#" + confirmPasswordInputId).val("");

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
                    $("#" + contentId).append($('<li/>').text(userList[i].nickname));

                }

                var loginButtonId = contentId + "_loginButton";
                $("#" + contentId).append($('<br/>'))
                    .append($('<button/>').attr("id", loginButtonId).text("Login"));

                $("#" + loginButtonId).click(function () {

                    loginComponent.init();

                });

            }

        };

        return {"init": _initialize};
    };

    var LoginComponent = function (chatRoomDivId) {

        var _initialize = function () {

            $("#" + registrationBoxId).remove();
            $("#" + userListBoxId).remove();

            $("#" + chatRoomDivId).append($('<div/>').attr("id", loginBoxId));

            var buttonId = loginBoxId + "_button";
            var nicknameInputId = loginBoxId + "_nickname";
            var passwordInputId = loginBoxId + "_password";

            var loginMessageId = loginBoxId + "_message";

            $("#" + loginBoxId).append($('<label/>').text("Nickname")).append($('<br/>'))
                .append($('<input/>').attr("id", nicknameInputId).attr("type", "text"))
                .append($('<br/>'))
                .append($('<label/>').text("Password")).append($('<br/>'))
                .append($('<input/>').attr("id", passwordInputId).attr("type", "password"))
                .append($('<br/>'))
                .append($('<div/>').attr("id", loginMessageId)).append($('<br/>'))
                .append($('<button/>').attr("id", buttonId).text('Login'));


            $("#" + buttonId).click(function () {

                var userData = {
                    nickname: $("#" + nicknameInputId).val(),
                    password: $("#" + passwordInputId).val()

                };

                console.log("Trying to login user " + userData.nickname);
                eventbus.post(events.USER_IS_LOGGED_IN, userData);

            });
        };

        var _displayLoginError = function (failLoginEvent) {

            var errorElementRootId = loginBoxId + "_message";

            $("#" + errorElementRootId).html($('<p/>').attr("style", "color:red")
                .text(failLoginEvent.message));
        };

        return {
            "init": _initialize,
            "showLoginError": _displayLoginError
        };
    };


    var ChatComponent = function (chatRoomDivId) {

        var _initialize = function (userLoggedInEvent) {

            $("#" + loginBoxId).remove();

            var chatComponentId = chatRoomDivId + "_chat";

            $("#" + chatRoomDivId).append($('<div/>').attr("id", chatComponentId));

            var createChatButtonId = chatComponentId + "_createChatButton";
            var joinChatButtonId = chatComponentId + "_joinChatButton";

            $("#" + chatComponentId).append($('<h3/>').text(userLoggedInEvent.message))
                .append($('<button/>').attr("id", createChatButtonId).text("Create chat"))
                .append($('<button/>').attr("id", joinChatButtonId).text("Join chat"));

            $("#" + createChatButtonId).click(function () {

                var chatNameInputId = chatComponentId + "_chatName";
                var confirmButtonId = chatComponentId + "_confirmButton";

                $("#" + chatComponentId).append($('<div/>'))
                    .append($('<label/>').text("Enter chat name:")).append($('<br/>'))
                    .append($('<input/>').attr("id", chatNameInputId).attr("type", "text"))
                    .append($('<button/>').attr("id", confirmButtonId).text("OK"));


                $("#" + confirmButtonId).click(function () {

                    var chatData = {

                        "name": $("#" + chatNameInputId).val(),
                        "owner": userLoggedInEvent.user.nickname
                    };

                    console.log("User " + userLoggedInEvent.user.nickname + " is trying to create chat " + chatData.name);

                    eventbus.post(events.CHAT_IS_CREATED, chatData);

                });

            });

            $("#" + joinChatButtonId).click(function () {

                var chatNameInputId = chatComponentId + "_chatName";
                var confirmButtonId = chatComponentId + "_confirmButton";
                var errorMessageId = chatComponentId + "_errorMessage";

                $("#" + chatComponentId).append($('<div/>'))
                    .append($('<label/>').text("Enter chat name:")).append($('<br/>'))
                    .append($('<input/>').attr("id", chatNameInputId).attr("type", "text"))
                    .append($('<button/>').attr("id", confirmButtonId).text("OK"))
                    .append($('<p/>').attr("id", errorMessageId));


                $("#" + confirmButtonId).click(function () {

                    var chatData = {

                        "name": $("#" + chatNameInputId).val(),
                        "user": userLoggedInEvent.user.nickname
                    };

                    console.log("User " + userLoggedInEvent.user.nickname + " is trying to create chat " + chatData.name);

                    eventbus.post(events.MEMBER_IS_ADDED_TO_CHAT, chatData);

                });

            });
        };

        var _showErrorMessage = function (errorEvent) {

            $("#" + chatRoomDivId + "_chat_errorMessage").attr("style", "color:red")
                .text(errorEvent.message);
        };

        var _showChat = function (chatData) {

            var chatId = chatRoomDivId + "_chat";

            $("#" + chatRoomDivId).html($('<div/>').attr("id", chatId));

            $("#" + chatId).append($('<h4/>').text(chatData.name))
                .append($('<label/>').text("Members: "));


            for (var i = 0; i < chatData.members.length; i++) {
                $("#" + chatId).append($('<span/>').text(chatData.members[i] + " "));
            }


            var messagesId = chatId + "_messages";

            $("#" + chatId).append($('<br/>')).append($('<div/>').attr("id", messagesId));

            var messages = chatData.messages;

            if (typeof messages !== "undefined") {

                for (var i = 0; i < messages.length; i++) {

                    $("#" + messagesId).append($('<li/>').text(messages[i].author + ": " + messages[i].message));
                }

                var messageInputId = chatId + "_newMessage";
                var postButtonId = chatId + "_postButton";
                var addMemberButtonId = chatId + "_addMemberButton";

                $("#" + chatId).append($('<input/>').attr("id", messageInputId)).attr("type", "text")
                    .append($('<button/>').attr("id", postButtonId).text("Post")).append($('<br/>'))
                    .append($('<button/>').attr("id", addMemberButtonId).text("Add member"));

                var selectMemberId = chatId + "_select";
                $("#" + chatId).append($('<select/>').attr("id", selectMemberId));

                var users = userService.getAllUsers();

                for (var i = 0; i < users.length; i++) {
                    if ($.inArray(users[i].nickname, chatData.members) === -1) {
                        $("#" + selectMemberId).append($('<option/>').text(users[i].nickname));
                    }
                }


                $("#" + postButtonId).click(function () {


                    var updatedChatData = {
                        "chatName": chatData.name,
                        "author": chatData.members[0],
                        "message": $("#" + messageInputId).val()
                    };

                    console.log("Posting message by " + updatedChatData.author);

                    eventbus.post(events.MESSAGE_IS_POSTED, updatedChatData);
                });

                $("#" + addMemberButtonId).click(function () {

                    var chosen = $("#" + selectMemberId).val();
                    console.log("Chosen user " + chosen + " to join chat " + chatData.name);

                    var newData = {
                        "name": chatData.name,
                        "user": chosen
                    };
                    eventbus.post(events.MEMBER_IS_ADDED_TO_CHAT, newData);

                });
            }
        };

        return {
            "init": _initialize,
            "showErrorMessage": _showErrorMessage,
            "showChat": _showChat
        };
    };

    var registrationComponent = new RegistrationComponent(registrationBoxId, eventbus);
    var userListComponent = new UserListComponent(userListBoxId);
    var chatComponent = new ChatComponent(chatRoomDivId);
    var loginComponent = new LoginComponent(chatRoomDivId);

    registrationComponent.init();


    eventbus.subscribe(events.USER_IS_ADDED, userService.addUser);
    eventbus.subscribe(events.REGISTRATION_FAILED, registrationComponent.showRegistrationError);
    eventbus.subscribe(events.REGISTRATION_IS_SUCCESSFUL, registrationComponent.showSuccessfulRegistrationMessage);
    eventbus.subscribe(events.USERS_UPDATED, userListComponent.init);
    eventbus.subscribe(events.USER_IS_LOGGED_IN, userService.loginUser);
    eventbus.subscribe(events.LOGIN_FAILED, loginComponent.showLoginError);
    eventbus.subscribe(events.LOGIN_IS_SUCCESSFUL, chatComponent.init);
    eventbus.subscribe(events.CHAT_IS_CREATED, chatService.addChat);
    eventbus.subscribe(events.CHAT_UPDATED, chatComponent.showChat);
    eventbus.subscribe(events.MESSAGE_IS_POSTED, chatService.postMessage);
    eventbus.subscribe(events.MEMBER_IS_ADDED_TO_CHAT, chatService.addMember);
    eventbus.subscribe(events.JOINING_CHAT_FAIL, chatComponent.showErrorMessage);

};


define(function () {
    return ChatRoom;
});
