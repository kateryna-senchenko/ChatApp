var UserService = function (eventbus, events, storage) {

    var _collectionName = "users";

    var User = function (nickname, password) {

        return{
            "nickname": nickname,
            "password": password
        }
    };


    var RegistrationEvent = function (message) {
        this.message = message;
        return this.message;
    };


    var _registerUser = function (userData) {

        if (typeof storage.findByPropertyValue(_collectionName, "nickname", userData.newNickname) !== "undefined") {

            var _userExistMessage = "User with specified nickname is already exist";
            eventbus.post(events.REGISTRATION_FAILED, new RegistrationEvent(_userExistMessage));

        } else if (userData.newUserPassword !== userData.newUserConfirmationPassword) {

            var _passwordsDoNOtMatchMessage = "Passwords do not match";
            eventbus.post(events.REGISTRATION_FAILED, new RegistrationEvent(_passwordsDoNOtMatchMessage));

        } else {

            var newUser = new User(userData.newNickname, userData.newUserPassword);

            storage.add(_collectionName, newUser);

            console.log("Registered user " + userData.newNickname);

            var _userAddedMessage = "User " + userData.newNickname + " is successfully registered";

            eventbus.post(events.REGISTRATION_IS_SUCCESSFUL, new RegistrationEvent(_userAddedMessage));
            eventbus.post(events.USERS_UPDATED, storage.getAll(_collectionName));
        }
    };


    return {
        "addUser": _registerUser
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserService;
});
	