var UserRegistrationEvents = {


        USER_IS_ADDED : "userIsAdded",
        REGISTRATION_FAILED: "registrationFailed",
        REGISTRATION_IS_SUCCESSFUL: "registrationIsSuccessful",
        USERS_UPDATED: "usersUpdated"


};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserRegistrationEvents;
});

