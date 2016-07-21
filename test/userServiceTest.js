var UserService = require('../scripts/userService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');

var eb = new EventBus();
var events = require('../scripts/chatEvents');
var storage = new Storage();
var userService = new UserService(eb, events, storage);


describe('User service should', function() {

    it('Register new users', function() {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingChats = 0;
        } else {
            existingChats = storage.getAll(collectionName).length;
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

        eb.post(events.ATTEMPT_TO_ADD_USER, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
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

        eb.post(events.ATTEMPT_TO_ADD_USER, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).nickname).is(nicknameSecond);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).password).is(passwordSecond);
    });



    it("Fail to register users with identical nicknames", function(){

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingChats = 0;
        } else {
            existingChats = storage.getAll(collectionName).length;
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

        eb.post(events.ATTEMPT_TO_ADD_USER, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var deliveredSecond = false;

        var messageSecond = "Specified nickname is not available";

        eb.subscribe(events.REGISTRATION_FAILED, function(e){
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.ATTEMPT_TO_ADD_USER, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChats);

    });



    it("Fail to register users if passwords do not match", function(){

        var collectionName = "users";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsers;

        if(typeof storage.getAll(collectionName) === "undefined"){
            existingChats = 0;
        } else {
            existingChats = storage.getAll(collectionName).length;
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

        eb.post(events.ATTEMPT_TO_ADD_USER, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChats);
    });

});
