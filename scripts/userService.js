var UserService = function (eventBus) {

    var _storage = {};

    var _failRegistrationEvent = {
        "message": ""
    }

    var _registerUser = function (AddUserEvent) {

        if (typeof _storage[AddUserEvent.newNickname] !== "undefined") {

            _failRegistrationEvent.message = "User with specified nickname is already exist"
            eventBus.post("failRegistration", _failRegistrationEvent);

        } else if (AddUserEvent.newUserPassword !== AddUserEvent.newUserConfirmationPassword) {

            _failRegistrationEvent.message = "Passwords do not match"
            eventBus.post("failRegistration", _failRegistrationEvent);

        } else {
            _storage[AddUserEvent.newNickname] = AddUserEvent.newUserPassword;
            console.log("Registered user " + AddUserEvent.newNickname + " with password "
                + _storage[AddUserEvent.newNickname]);

            eventBus.post("displayUsers", Object.keys(_storage));
        }
    }

    return {"addUser": _registerUser};
}

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserService;
});
	