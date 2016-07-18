var UserService = require('../scripts/userService');
var EventBus = require('../scripts/eventbus');
var UserRegistrationEvents = require('../scripts/userRegistrationEvents');
var unitjs = require('unit.js');

var eb = EventBus();
var events = UserRegistrationEvents();
var userService = UserService(eb, events);


describe('Test user registration', function() {

    it('Fail to register new users', function() {


        var nicknameFirst = "Alice";
        var passwordFirst = "fromwonderland";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredFirst = (messageFirst === e.message);
        });


        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        userService.addUser(firstUserData);


        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(userService.UserStorage.getAllUsers().length).is(1);
        unitjs.string(userService.UserStorage.getPassword(nicknameFirst)).is(passwordFirst);


        var nicknameSecond = "Kapitoshka";
        var passwordSecond ="123456789";
        var deliveredSecond = false;

        var messageSecond = "User " + nicknameSecond + " is successfully registered";

        eb.subscribe(events.events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameSecond,
            newUserPassword: passwordSecond,
            newUserConfirmationPassword: passwordSecond
        };

        userService.addUser(secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(userService.UserStorage.getAllUsers().length).is(2);
        unitjs.string(userService.UserStorage.getPassword(nicknameSecond)).is(passwordSecond);
    });

    it("Registration with two identical nicknames does not fail", function(){

        var existingUsers = userService.UserStorage.getAllUsers().length;
        var nicknameFirst = "Neo";
        var passwordFirst = "followthewhiterabbit";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredFirst = (messageFirst === e.message);
        });


        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        userService.addUser(firstUserData);


        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(userService.UserStorage.getAllUsers().length).is(++existingUsers);
        unitjs.string(userService.UserStorage.getPassword(nicknameFirst)).is(passwordFirst);


        var deliveredSecond = false;

        var messageSecond = "User with specified nickname is already exist";

        eb.subscribe(events.events.REGISTRATION_FAILED, function(e){
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        userService.addUser(secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(userService.UserStorage.getAllUsers().length).is(existingUsers);

    });



    it("Registration with not matching passwords does not fail ", function(){

        var existingUsers = userService.UserStorage.getAllUsers().length;

        var nicknameFirst = "Kevin";
        var passwordFirst = "imademyfamilydisappear";
        var passwordSecond = "notthesame";

        var deliveredFirst = false;

        var messageFirst = "Passwords do not match";

        eb.subscribe(events.events.REGISTRATION_FAILED, function(e){
            deliveredFirst = (messageFirst === e.message);
        });

        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordSecond
        };

        userService.addUser(firstUserData);
        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(userService.UserStorage.getAllUsers().length).is(existingUsers);

    });

});
