var UserService = function (eventBus) {

    var UserStorage = function(){

        var _storage = {};

        var _getValueByKey = function(key){
           return _storage[key];
        };

        var _setValue = function(key, value){
            _storage[key] = value;
        };

        var _getAllKeys = function () {
            return Object.keys(_storage);
        };

        return {"getPassword": _getValueByKey,
                "addUser": _setValue,
                "getAllUsers": _getAllKeys };
    };

    var userStorage = new UserStorage();

    var _failRegistrationEvent = {
        "message": ""
    };

    var _successfulRegistrationEvent = {
        "message": ""
    };

    var _registerUser = function (AddUserEvent) {

        if (typeof userStorage.getPassword(AddUserEvent.newNickname) !== "undefined") {

            _failRegistrationEvent.message = "User with specified nickname is already exist";
            eventBus.post("failRegistration", _failRegistrationEvent);

        } else if (AddUserEvent.newUserPassword !== AddUserEvent.newUserConfirmationPassword) {

            _failRegistrationEvent.message = "Passwords do not match";
            eventBus.post("failRegistration", _failRegistrationEvent);

        } else {

            userStorage.addUser(AddUserEvent.newNickname, AddUserEvent.newUserPassword);

            console.log("Registered user " + AddUserEvent.newNickname + " with password "
                + userStorage.getPassword(AddUserEvent.newNickname));

            _successfulRegistrationEvent.message = "User " + AddUserEvent.newNickname + " is successfully registered"

            eventBus.post("successfulRegistration", _successfulRegistrationEvent);
            eventBus.post("displayUsers", userStorage.getAllUsers());
        }
    };


    return {"addUser": _registerUser,
            "UserStorage": userStorage};
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return UserService;
});
	