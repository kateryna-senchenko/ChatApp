var UserService = function (eventbus, events, storage) {

    var _collectionName = "users";

    var User = function (nickname, password) {

        return {
            "nickname": nickname,
            "password": password
        }
    };


    var UserServiceEventTemplate = function (message, user) {
        return {
            "message": message,
            "user": user
        }
    };

    var sessions = [];

    var _registerUser = function (userData) {

        userData.newNickname = userData.newNickname.trim();

        if ((userData.newNickname.indexOf(" ") >= 0) || (userData.newNickname.length === 0)) {

            var _invalidInputMessage = "Nickname should not be empty or contain white spaces";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEventTemplate(_invalidInputMessage));

        } else if (userData.newUserPassword.length === 0) {

            var _invalidInputMessage = "Password should not be empty";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEventTemplate(_invalidInputMessage));

        } else if (storage.findByPropertyValue(_collectionName, "nickname", userData.newNickname) !== null) {

            var _userExistMessage = "Specified nickname is not available";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEventTemplate(_userExistMessage));

        } else if (userData.newUserPassword !== userData.newUserConfirmationPassword) {

            var _passwordsDoNotMatchMessage = "Passwords do not match";
            eventbus.post(events.REGISTRATION_FAILED, new UserServiceEventTemplate(_passwordsDoNotMatchMessage));

        } else {

            var newUser = new User(userData.newNickname, userData.newUserPassword);

            storage.add(_collectionName, newUser);

            console.log("Registered user " + userData.newNickname);

            var _userAddedMessage = "User " + userData.newNickname + " is successfully registered";

            eventbus.post(events.REGISTRATION_IS_SUCCESSFUL, new UserServiceEventTemplate(_userAddedMessage));
            eventbus.post(events.USERS_UPDATED, storage.getAll(_collectionName));
        }
    };

    var _loginUser = function (userData) {

        var user = storage.findByPropertyValue(_collectionName, "nickname", userData.nickname);

        if ((user === null) || (user.password !== userData.password)) {

            var _loginErrorMessage = "Specified combination of nickname and password was not found";
            eventbus.post(events.LOGIN_FAILED, new UserServiceEventTemplate(_loginErrorMessage));

        } else {

            sessions.push(user);
            console.log("User " + userData.nickname + " is logged in");

            var _userLoggedInMessage = "Welcome " + userData.nickname;

            eventbus.post(events.LOGIN_IS_SUCCESSFUL, new UserServiceEventTemplate(_userLoggedInMessage, user));

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
	