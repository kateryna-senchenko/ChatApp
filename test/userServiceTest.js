var UserService = require('../scripts/userService');
var EventBus = require('../scripts/eventbus');
var unitjs = require('unit.js');

var eb = EventBus();

var userService = UserService(eb);

var firstUserData = {
    newNickname: "Alice",
    newUserPassword: "fromwonderland",
    newUserConfirmationPassword: "fromwonderland"
};

userService.addUser(firstUserData);

describe('Test user registration', function() {

    it('Successfully registered users', function() {

        this.timeout(1000);
        unitjs.number(userService.UserStorage.getAllUsers().length).is(1);
        unitjs.string(userService.UserStorage.getPassword("Alice")).is("fromwonderland");

        var secondUserData = {
            newNickname: "Kapitoshka",
            newUserPassword: "348",
            newUserConfirmationPassword: "348"
        };

        userService.addUser(secondUserData);

        this.timeout(1000);
        unitjs.number(userService.UserStorage.getAllUsers().length).is(2);
        unitjs.string(userService.UserStorage.getPassword("Kapitoshka")).is("348");

    });

    it("Cannot register users with identical nicknames", function(){

        userService.addUser(firstUserData);
        this.timeout(1000);
        unitjs.number(userService.UserStorage.getAllUsers().length).is(2);

    });

    it("Cannot register users if passwords do not match", function(){

        var thirdUserData = {
            newNickname: "Sloth",
            newUserPassword: "34",
            newUserConfirmationPassword: "348"
        };

        userService.addUser(thirdUserData);
        this.timeout(1000);
        unitjs.number(userService.UserStorage.getAllUsers().length).is(2);

    });

});
