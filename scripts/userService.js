var UserService = function (eventBus, userRegistrationEvents) {

    var UserStorage = function () {

        var _storage = {};

        var _getValueByKey = function (key) {
            return _storage[key];
        };

        var _setValue = function (key, value) {
            _storage[key] = value;
        };

        var _getAllKeys = function () {
            return Object.keys(_storage);
        };

        return {
            "getPassword": _getValueByKey,
            "addUser": _setValue,
            "getAllUsers": _getAllKeys
        };
    };


    var userStorage = new UserStorage();


    var RegistrationEvent = function(message){
        this.message = message;
        return this.message;
    };

    var _registerUser = function (AddUserEvent) {

        if (typeof userStorage.getPassword(AddUserEvent.newNickname) !== "undefined") {

            var _userExistMessage = "User with specified nickname is already exist";
            eventBus.post(userRegistrationEvents.events.REGISTRATION_FAILED, new RegistrationEvent(_userExistMessage));

        } else if (AddUserEvent.newUserPassword !== AddUserEvent.newUserConfirmationPassword) {

            var _passwordsDoNOtMatchMessage = "Passwords do not match";
            eventBus.post(userRegistrationEvents.events.REGISTRATION_FAILED, new RegistrationEvent(_passwordsDoNOtMatchMessage));

        } else {

            userStorage.addUser(AddUserEvent.newNickname, AddUserEvent.newUserPassword);

            console.log("Registered user " + AddUserEvent.newNickname);

            var _userAddedMessage = "User " + AddUserEvent.newNickname + " is successfully registered";

            eventBus.post(userRegistrationEvents.events.REGISTRATION_IS_SUCCESSFUL, new RegistrationEvent(_userAddedMessage));
            eventBus.post(userRegistrationEvents.events.USERS_UPDATED, userStorage.getAllUsers());
        }
    };


    return {
        "addUser": _registerUser,
        "UserStorage": userStorage
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserService;
});
	