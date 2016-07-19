var UserService = function (eventBus, userRegistrationEvents, storage) {

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
            eventBus.post(userRegistrationEvents.REGISTRATION_FAILED, new RegistrationEvent(_userExistMessage));

        } else if (userData.newUserPassword !== userData.newUserConfirmationPassword) {

            var _passwordsDoNOtMatchMessage = "Passwords do not match";
            eventBus.post(userRegistrationEvents.REGISTRATION_FAILED, new RegistrationEvent(_passwordsDoNOtMatchMessage));

        } else {

            var newUser = new User(userData.newNickname, userData.newUserPassword);

            storage.add(_collectionName, newUser);

            console.log("Registered user " + userData.newNickname);

            var _userAddedMessage = "User " + userData.newNickname + " is successfully registered";

            eventBus.post(userRegistrationEvents.REGISTRATION_IS_SUCCESSFUL, new RegistrationEvent(_userAddedMessage));
            eventBus.post(userRegistrationEvents.USERS_UPDATED, storage.getAll(_collectionName));
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
	