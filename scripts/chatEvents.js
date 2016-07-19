var ChatEvents = {

    USER_IS_ADDED: "userIsAdded",
    REGISTRATION_FAILED: "registrationFailed",
    REGISTRATION_IS_SUCCESSFUL: "registrationIsSuccessful",
    USERS_UPDATED: "usersUpdated",
    CHAT_IS_CREATED: "chatIsCreated",
    CHAT_NOT_CREATED: "chatCreationFailed",
    CHAT_MEMBERS_UPDATED: "chatMembersUpdated",
    CHAT_MESSAGES_UPDATED: "messagesUpdated"


};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return ChatEvents;
});

