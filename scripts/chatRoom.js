var ChatRoom = function (chatRoomDivId, eventbus, events, userService, chatService) {


    var RegistrationComponent = function () {

        var registrationBoxId = chatRoomDivId + '_registration';

        var _initialize = function () {

            $('#' + chatRoomDivId).append($('<div/>').attr('id', registrationBoxId));

            var contentId = registrationBoxId + "_content";
            $('#' + registrationBoxId).html($('<div/>').attr('id', contentId));

            var buttonId = registrationBoxId + '_button';
            var nicknameInputId = registrationBoxId + '_nickname';
            var passwordInputId = registrationBoxId + '_password';
            var confirmPasswordInputId = registrationBoxId + '_confirm_password';
            var registrationMessageId = registrationBoxId + '_message';

            $('#' + contentId).html($('<fieldset/>'));
            $('<legend/>').text('Registration').appendTo($('fieldset'));
            $('<input/>').attr('id', nicknameInputId).attr({
                'type': 'text',
                'placeholder': 'Nickname'
            }).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<input/>').attr('id', passwordInputId).attr({
                'type': 'password',
                'placeholder': 'Password'
            }).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<input/>').attr('id', confirmPasswordInputId).attr({
                'type': 'password',
                'placeholder': 'Confirm password'
            }).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<p/>').attr('id', registrationMessageId).text('')
                .appendTo($('fieldset'));
            $('<button/>').attr('id', buttonId).text('Register').appendTo($('fieldset'));

            var loginButtonId = contentId + '_loginButton';
            $('<button/>').attr('id', loginButtonId).text('Login').appendTo($('fieldset'));


            $('#' + loginButtonId).click(function () {

                $('#' + registrationBoxId).remove();
                eventbus.post(events.ATTEMPT_TO_RENDER_LOGIN_FORM);

            });

            $('#' + buttonId).click(function () {

                var newUserData = {
                    newNickname: $('#' + nicknameInputId).val(),
                    newUserPassword: $('#' + passwordInputId).val(),
                    newUserConfirmationPassword: $('#' + confirmPasswordInputId).val()
                };

                console.log('User ' + newUserData.newNickname + ' data posting');
                eventbus.post(events.ATTEMPT_TO_ADD_USER, newUserData);

            });
        };

        var _displayRegistrationError = function (failRegistrationEvent) {

            var errorElementRootId = registrationBoxId + '_message';
            $('#' + errorElementRootId).html($('<p/>').attr('style', 'color:red; font-size:14; font-family:"Calibri"')
                .text(failRegistrationEvent.message));
        };

        var _displayRegistrationMessage = function (successfulRegistrationEvent) {

            var messageElementRootId = registrationBoxId + '_message';
            $('#' + messageElementRootId).html($('<p/>').attr('style', 'color:green; font-size:14; font-family:"Calibri"')
                .text(successfulRegistrationEvent.message));

            var nicknameInputId = registrationBoxId + '_nickname';
            var passwordInputId = registrationBoxId + '_password';
            var confirmPasswordInputId = registrationBoxId + '_confirm_password';
            $('#' + nicknameInputId).val('');
            $('#' + passwordInputId).val('');
            $('#' + confirmPasswordInputId).val('');

        };


        return {
            "init": _initialize,
            "showRegistrationError": _displayRegistrationError,
            "showSuccessfulRegistrationMessage": _displayRegistrationMessage
        };
    };


    var LoginComponent = function () {

        var loginBoxId = chatRoomDivId + '_login';

        var _initialize = function () {

            $('#' + chatRoomDivId).append($('<div/>').attr('id', loginBoxId));

            var buttonId = loginBoxId + '_button';
            var nicknameInputId = loginBoxId + '_nickname';
            var passwordInputId = loginBoxId + '_password';

            var loginMessageId = loginBoxId + '_message';

            $('#' + loginBoxId).html($('<fieldset/>'));
            $('<legend/>').text('Login').appendTo($('fieldset'));
            $('<input/>').attr('id', nicknameInputId).attr({
                'type': 'text',
                'placeholder': 'Nickname'
            }).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<input/>').attr('id', passwordInputId).attr({
                'type': 'password',
                'placeholder': 'Password'
            }).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<p/>').attr('id', loginMessageId).text('').appendTo($('fieldset'));
            $('<button/>').attr('id', buttonId).text('Login').appendTo($('fieldset'));


            $('#' + buttonId).click(function () {

                var userData = {
                    nickname: $('#' + nicknameInputId).val(),
                    password: $('#' + passwordInputId).val()

                };

                console.log('Trying to login user ' + userData.nickname);
                eventbus.post(events.ATTEMPT_TO_LOGIN_USER, userData);

            });
        };

        var _displayLoginError = function (failLoginEvent) {

            var errorElementRootId = loginBoxId + '_message';

            $('#' + errorElementRootId).html($('<p/>').attr('style', 'color:red; font-size:14; font-family:"Calibri"')
                .text(failLoginEvent.message));
        };

        var _closeLoginForm = function () {

            $('#' + loginBoxId).remove();
        };

        return {
            "init": _initialize,
            "showLoginError": _displayLoginError,
            "closeLoginForm": _closeLoginForm
        };
    };


    var ChatComponent = function () {

        var chatComponentId = chatRoomDivId + '_chat';

        var _initialize = function (userLoggedInEvent) {

            $('#' + chatRoomDivId).html($('<div/>').attr('id', chatComponentId));

            var chatHeaderId = chatComponentId + '_header';
            var chatNameInputId = chatComponentId + '_chatName';
            var createChatButtonId = chatComponentId + '_createChatButton';
            var selectChatId = chatComponentId + '_selectChat';
            var joinChatButtonId = chatComponentId + '_joinChatButton';
            var createChatErrorId = chatComponentId + '_createChatError';

            $('#' + chatComponentId).append($('<fieldset/>').attr('id', chatHeaderId));
            $('<label/>').text(userLoggedInEvent.message).appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<input/>').attr('id', chatNameInputId).attr({
                'type': 'text',
                'placeholder': 'Chat name'
            }).appendTo($('fieldset'));
            $('<button/>').attr('id', createChatButtonId).text('Create chat').appendTo($('fieldset'));
            $('<select/>').attr('id', selectChatId).appendTo($('fieldset'));
            $('<button/>').attr('id', joinChatButtonId).text('Join chat').appendTo($('fieldset'));
            $('<br>').appendTo($('fieldset'));
            $('<p/>').attr('id', createChatErrorId).text('').appendTo($('fieldset'));


            $('#' + createChatButtonId).click(function () {

                var chatData = {
                    'name': $('#' + chatNameInputId).val(),
                    'owner': userLoggedInEvent.user.nickname
                };

                console.log('User ' + userLoggedInEvent.user.nickname + ' is trying to create chat ' + chatData.name);

                eventbus.post(events.ATTEMPT_TO_CREATE_CHAT, chatData);


            });

            $('#' + joinChatButtonId).click(function () {

                var selectedChatName = $('#' + selectChatId).val();

                var chatData = {

                    'chatName': selectedChatName,
                    'user': userLoggedInEvent.user.nickname
                };

                console.log('User ' + userLoggedInEvent.user.nickname + ' is trying to join chat ' + chatData.chatName);

                eventbus.post(events.ATTEMPT_TO_ADD_MEMBER, chatData);

                });

        };

        var _updateAvailableChats = function (allChats) {

            var chatNameInputId = chatComponentId + '_chatName';
            var selectChatId = chatComponentId + '_selectChat';
            var createChatErrorId = chatComponentId + '_createChatError';

            $('#' + chatNameInputId).val('');
            $('#' + createChatErrorId).text('');

            $('#' + selectChatId).find('option').remove();


            for (var i = 0; i < allChats.length; i++) {
                $('#' + selectChatId).append($('<option/>').text(allChats[i].name));
            }

        };
        var _showErrorMessage = function (errorEvent) {

            $('#' + chatComponentId + '_createChatError').attr('style', 'color:red; font-size:14; font-family:"Calibri"')
                .text(errorEvent.message);
        };

        var _showChat = function (chatData) {

            var chatBoxId = chatRoomDivId + '_' + chatData.chat.name;
            var messagesId = chatBoxId + '_messages';
            var messageInputId = chatBoxId + '_newMessage';
            var sendButtonId = chatBoxId + '_send';
            var leaveButtonId = chatBoxId + '_leave';


            $('#' + chatRoomDivId).append($('<div/>').attr({'id': chatBoxId, 'class': 'chatBox'}));
            $('#' + chatBoxId).append($('<label/>')).text(chatData.chat.name)
                .append($('<button/>').attr({'class': 'leaveChat', 'id': leaveButtonId}).text('Leave'))
                .append($('<div/>'))
                .append($('<fieldset/>').attr({'id': messagesId, 'class': 'chatBody'}))
                .append($('<input/>').attr({
                    'id': messageInputId,
                    'class': 'messageText',
                    'type': 'text',
                    'placeholder': 'Type here'
                }))
                .append($('<button/>').attr({'id': sendButtonId, 'class': 'sendMessage'}).text('Send'));


            var messages = chatData.chat.messages;

            if (typeof messages !== 'undefined') {

                for (var i = 0; i < messages.length; i++) {
                    $('#' + messagesId).append($('<li/>').text(messages[i].author + ': ' + messages[i].message));
                }
            }


            $('#' + sendButtonId).click(function () {

                var updatedChatData = {
                    'chatName': chatData.chat.name,
                    'author': chatData.user,
                    'message': $("#" + messageInputId).val()
                };

                console.log('Posting message by ' + updatedChatData.author);

                eventbus.post(events.ATTEMPT_TO_POST_MESSAGE, updatedChatData);
            });


            $('#' + leaveButtonId).click(function () {

                eventbus.post(events.ATTEMPT_TO_LEAVE_CHAT, chatData);
                $('#' + chatBoxId).remove();
            });

        };

        var _updateMessages = function (chatData) {

            var messagesId = chatRoomDivId + '_' + chatData.name + '_messages';
            var messages = chatData.messages;
            var messageInputId = chatRoomDivId + '_' + chatData.name + '_newMessage';

            $('#' + messagesId).find($('li')).remove();
            $('#' + messageInputId).val('');

            if (typeof messages !== 'undefined') {

                for (var i = 0; i < messages.length; i++) {
                    $('#' + messagesId).append($('<li/>').text(messages[i].author + ': ' + messages[i].message));
                }
            }

        };
        return {
            "init": _initialize,
            "showErrorMessage": _showErrorMessage,
            "showChat": _showChat,
            "updateAvailableChats": _updateAvailableChats,
            "updateMessages": _updateMessages
        };
    };

    var registrationComponent = new RegistrationComponent();
    var chatComponent = new ChatComponent();
    var loginComponent = new LoginComponent();

    registrationComponent.init();


    eventbus.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);
    eventbus.subscribe(events.REGISTRATION_FAILED, registrationComponent.showRegistrationError);
    eventbus.subscribe(events.REGISTRATION_IS_SUCCESSFUL, registrationComponent.showSuccessfulRegistrationMessage);
    eventbus.subscribe(events.ATTEMPT_TO_RENDER_LOGIN_FORM, loginComponent.init);
    eventbus.subscribe(events.ATTEMPT_TO_LOGIN_USER, userService.loginUser);
    eventbus.subscribe(events.LOGIN_FAILED, loginComponent.showLoginError);
    eventbus.subscribe(events.LOGIN_IS_SUCCESSFUL, loginComponent.closeLoginForm);
    eventbus.subscribe(events.LOGIN_IS_SUCCESSFUL, chatComponent.init);
    eventbus.subscribe(events.CHAT_IS_CREATED, chatComponent.updateAvailableChats);
    eventbus.subscribe(events.CHAT_CREATION_FAILED, chatComponent.showErrorMessage);
    eventbus.subscribe(events.CHAT_UPDATED, chatComponent.updateMessages);
    eventbus.subscribe(events.ATTEMPT_TO_CREATE_CHAT, chatService.addChat);
    eventbus.subscribe(events.ATTEMPT_TO_POST_MESSAGE, chatService.postMessage);
    eventbus.subscribe(events.ATTEMPT_TO_ADD_MEMBER, chatService.addMember);
    eventbus.subscribe(events.MEMBER_IS_ADDED, chatComponent.showChat);
    eventbus.subscribe(events.ATTEMPT_TO_LEAVE_CHAT, chatService.removeMember);
    eventbus.subscribe(events.JOINING_CHAT_FAIL, chatComponent.showErrorMessage);

};


define(function () {
    return ChatRoom;
});
