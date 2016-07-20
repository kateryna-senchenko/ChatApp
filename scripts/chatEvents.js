var ChatEvents = {

    USER_IS_ADDED: "userIsAdded",
    REGISTRATION_FAILED: "registrationFailed",
    REGISTRATION_IS_SUCCESSFUL: "registrationIsSuccessful",
    USERS_UPDATED: "usersUpdated",
    CHAT_IS_CREATED: "chatIsCreated",
    CHAT_NOT_CREATED: "chatCreationFailed",
    CHAT_UPDATED: "chatUpdated",
    MESSAGE_IS_POSTED: "messageIsPosted",
    USER_IS_LOGGED_IN: "userIsLoggedIn",
    LOGIN_FAILED: "loginFailed",
    LOGIN_IS_SUCCESSFUL: "loginIsSuccessful",
    MEMBER_IS_ADDED_TO_CHAT: "memberIsAddedToChat",
    JOINING_CHAT_FAIL: "joiningChatFail"
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return ChatEvents;
});

