var UserService = function (eventbus, events, storage) {

    var _collectionName = "users";

    var User = function (nickname, password) {

        return {
            "nickname": nickname,
            "password": password
        }
    };


    var UserServiceEvent = function (message, user) {
        return {
            "message": message,
            "user": user
        }
    };

    var sessions = [];

    var _registerUser = function (userData) {

        if (typeof storage.findByPropertyValue(_collectionName, "nickname", userData.newNickname) !== "undefined") {

            var _userExistMessage = "User with specified nickname is already exist";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEvent(_userExistMessage));

        } else if (userData.newUserPassword !== userData.newUserConfirmationPassword) {

            var _passwordsDoNOtMatchMessage = "Passwords do not match";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEvent(_passwordsDoNOtMatchMessage));

        } else {

            var newUser = new User(userData.newNickname, userData.newUserPassword);

            storage.add(_collectionName, newUser);

            console.log("Registered user " + userData.newNickname);

            var _userAddedMessage = "User " + userData.newNickname + " is successfully registered";

            eventbus.post(events.REGISTRATION_IS_SUCCESSFUL, new UserServiceEvent(_userAddedMessage));
            eventbus.post(events.USERS_UPDATED, storage.getAll(_collectionName));
        }
    };

    var _loginUser = function (userData) {

        var user = storage.findByPropertyValue(_collectionName, "nickname", userData.nickname);

        if (typeof user === "undefined") {

            var _userNotExistMessage = "User with specified nickname is not registered";
            eventbus.post(events.LOGIN_FAILED, new UserServiceEvent(_userNotExistMessage));

        } else if (user.password !== userData.password) {

            var _passwordIncorrectMessage = "Password is incorrect";
            eventbus.post(events.LOGIN_FAILED, new UserServiceEvent(_passwordIncorrectMessage));

        } else {

            sessions.push(user);
            console.log("User " + userData.nickname + " is logged in");

            var _userLoggedInMessage = "Welcome, " + userData.nickname;

            eventbus.post(events.LOGIN_IS_SUCCESSFUL, new UserServiceEvent(_userLoggedInMessage, user));

        }

    };

    _getAllUsers = function () {

        return storage.getAll(_collectionName);
    };

    return {
        "addUser": _registerUser,
        "loginUser": _loginUser,
        "getAllUsers": _getAllUsers
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserService;
});
	