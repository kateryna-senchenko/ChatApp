var UserService = require('../scripts/userService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');

var eb = new EventBus();
var events = require('../scripts/chatEvents');
var storage = new Storage();
var userService = new UserService(eb, events, storage);


describe('User service should', function () {

    it('Register new users', function () {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Alice";
        var passwordFirst = "fromwonderland";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsersCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var nicknameSecond = "Kapitoshka";
        var passwordSecond = "123456789";
        var deliveredSecond = false;

        var messageSecond = "User " + nicknameSecond + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsersCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).nickname).is(nicknameSecond);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameSecond).password).is(passwordSecond);
    });


    it("Fail to register users with identical nicknames", function () {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Neo";
        var passwordFirst = "followthewhiterabbit";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsersCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var deliveredSecond = false;

        var messageSecond = "Specified nickname is not available";

        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);

    });


    it("Fail to register users if passwords do not match", function () {

        var collectionName = "users";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Kevin";
        var passwordFirst = "imademyfamilydisappear";
        var passwordSecond = "notthesame";

        var deliveredFirst = false;

        var messageFirst = "Passwords do not match";

        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);
    });


    it("Trim user nickname", function () {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Leo";
        var passwordFirst = "biglion";
        var deliveredFirst = false;

        var messageFirst = "User " + nicknameFirst + " is successfully registered";

        eb.subscribe(events.REGISTRATION_IS_SUCCESSFUL, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(++existingUsersCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).nickname).is(nicknameFirst);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nicknameFirst).password).is(passwordFirst);


        var deliveredSecond = false;
        var nicknameSecond = " Leo  ";
        var messageSecond = "Specified nickname is not available";

        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
            deliveredSecond = (messageSecond === e.message);
        });

        var secondUserData = {
            newNickname: nicknameSecond,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.ATTEMPT_TO_ADD_USER, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);

    });

    it("Fail to register user if nickname is empty or contains white spaces", function () {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "";
        var passwordFirst = "lostinnewyork";
        var deliveredFirst = false;

        var messageFirst = "Nickname should not be empty or contain white spaces";

        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);


        var deliveredSecond = false;
        var nicknameSecond = "Mi la";


        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
            deliveredSecond = (messageFirst === e.message);
        });

        var secondUserData = {
            newNickname: nicknameSecond,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.ATTEMPT_TO_ADD_USER, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);

    });

    it("Fail to register user if password is empty", function () {

        var collectionName = "users";
        var key = "nickname";

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var existingUsersCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingUsersCount = 0;
        } else {
            existingUsersCount = storage.getAll(collectionName).length;
        }


        var nicknameFirst = "Mila";
        var passwordFirst = "";
        var deliveredFirst = false;

        var messageFirst = "Password should not be empty";

        eb.subscribe(events.REGISTRATION_FAILED, function (e) {
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
        unitjs.number(storage.getAll(collectionName).length).is(existingUsersCount);

    });

    it('Login registered user', function () {

        eb.subscribe(events.ATTEMPT_TO_ADD_USER, userService.addUser);

        var collectionName = "sessions";
        var loggedInUsersCount;

        if (typeof  storage.getAll(collectionName) === "undefined") {
            loggedInUsersCount = 0;
        } else {
            loggedInUsersCount = storage.getAll(collectionName).length;
        }

        var nicknameFirst = "Mila";
        var passwordFirst = "lostinnewyork";

        var firstUserData = {
            newNickname: nicknameFirst,
            newUserPassword: passwordFirst,
            newUserConfirmationPassword: passwordFirst
        };

        eb.post(events.ATTEMPT_TO_ADD_USER, firstUserData);

        eb.subscribe(events.ATTEMPT_TO_LOGIN_USER, userService.loginUser);

        var deliveredFirst = false;

        var messageFirst = "Welcome " + nicknameFirst;

        eb.subscribe(events.LOGIN_IS_SUCCESSFUL, function (e) {
            deliveredFirst = (messageFirst === e.message);
        });

        var secondUserData = {
            nickname: nicknameFirst,
            password: passwordFirst

        };
        eb.post(events.ATTEMPT_TO_LOGIN_USER, secondUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++loggedInUsersCount);
        unitjs.string(storage.getAll(collectionName)[loggedInUsersCount - 1].nickname).is(nicknameFirst);
    });

    it('Fail to login unregistered user', function () {

        var loggedInUsersCount;
        var collectionName = "sessions";

        if (typeof  storage.getAll(collectionName).length === "undefined") {
            loggedInUsersCount = 0;
        } else {
            loggedInUsersCount = storage.getAll(collectionName).length;
        }

        var nicknameFirst = "Kevin";
        var passwordFirst = "imademyfamilydisappear";

        var firstUserData = {
            nickname: nicknameFirst,
            password: passwordFirst
        };


        eb.subscribe(events.ATTEMPT_TO_LOGIN_USER, userService.loginUser);

        var deliveredFirst = false;

        var messageFirst = "Specified combination of nickname and password was not found";

        eb.subscribe(events.LOGIN_FAILED, function (e) {
            deliveredFirst = (messageFirst === e.message);
        });

        eb.post(events.ATTEMPT_TO_LOGIN_USER, firstUserData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(loggedInUsersCount);

    });


});
