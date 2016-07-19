var UserService = require('../scripts/userService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');

var eb = EventBus();
var events = require('../scripts/chatEvents');
var storage = Storage();
var userService = UserService(eb, events, storage);


describe('Test user registration', function() {

    it('Fail to register new users', function() {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.USER_IS_ADDED, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingUsers = 0;
        } else {
            existingUsers = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Alice";
        var passwordFirst = "fromwonderland";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredFirst = (messageFirst === e.message);
        });


        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.USER_IS_ADDED, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsers);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var nicknameSecond = "Kapitoshka";
        var passwordSecond ="123456789";
        var deliveredSecond = false;

        var messageSecond = "User " + nicknameSecond + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameSecond,
            newUserPassword: passwordSecond,
            newUserConfirmationPassword: passwordSecond
        };

        eb.post(events.USER_IS_ADDED, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsers);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).nickname).is(nicknameSecond);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).password).is(passwordSecond);
    });



    it("Registration with two identical nicknames does not fail", function(){

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.USER_IS_ADDED, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingUsers = 0;
        } else {
            existingUsers = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Neo";
        var passwordFirst = "followthewhiterabbit";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function(e){
            deliveredFirst = (messageFirst === e.message);
        });


        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.USER_IS_ADDED, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsers);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var deliveredSecond = false;

        var messageSecond = "User with specified nickname is already exist";

        eb.subscribe(events.REGISTRATION_FAILED, function(e){
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.USER_IS_ADDED, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingUsers);

    });



    it("Registration with not matching passwords does not fail ", function(){

        var collectionName = "users";

        eb.subscribe(events.USER_IS_ADDED, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingUsers = 0;
        } else {
            existingUsers = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Kevin";
        var passwordFirst = "imademyfamilydisappear";
        var passwordSecond = "notthesame";

        var deliveredFirst = false;

        var messageFirst = "Passwords do not match";

        eb.subscribe(events.REGISTRATION_FAILED, function(e){
            deliveredFirst = (messageFirst === e.message);
        });

        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordSecond
        };

        eb.post(events.USER_IS_ADDED, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingUsers);
    });

});
