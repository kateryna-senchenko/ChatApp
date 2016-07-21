var ChatService = require('../scripts/chatService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');

var eb = new EventBus();
var events = require('../scripts/chatEvents');
var storage = new Storage();
var chatService = new ChatService(eb, events, storage);

describe('Chat service should', function() {

    it('Create new chats', function () {

        var collectionName = "chats";
        var key = "name";

        eb.subscribe(events.ATTEMPT_TO_CREATE_CHAT, chatService.addChat);

        var existingChats;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChats = 0;
        } else {
            existingChats = storage.getAll(collectionName).length;
        }


        var nameFirst = "abrakadabra";

        var userAlice = {
            "nickname": "Alice",
            "password": "formwonderland"
        };
        var deliveredFirst = false;


        eb.subscribe(events.CHAT_IS_CREATED, function (e) {
            deliveredFirst = (nameFirst === e.name);
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);


        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);



        var nameSecond = "coffeetime";
        var deliveredSecond = false;

        eb.subscribe(events.CHAT_IS_CREATED, function (e) {
            deliveredSecond = (nameSecond === e.name);
        });


        var secondChatData = {
            name: nameSecond,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, secondChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameSecond).name).is(nameSecond);

    });


    it("Fail to create chats with identical names", function () {

        var collectionName = "chats";
        var key = "name";

        eb.subscribe(events.ATTEMPT_TO_CREATE_CHAT, chatService.addChat);

        var existingChats;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChats = 0;
        } else {
            existingChats = storage.getAll(collectionName).length;
        }


        var nameFirst = "followthewhiterabbit";

        var userAlice = {
            "nickname": "Alice",
            "password": "formwonderland"
        };
        var deliveredFirst = false;


        eb.subscribe(events.CHAT_IS_CREATED, function (e) {
            deliveredFirst = (nameFirst === e.name);
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);

        var deliveredSecond = false;

        var messageSecond = "Specified name is not available";

        eb.subscribe(events.CHAT_CREATION_FAILED, function (e) {
            deliveredSecond = (messageSecond === e.message);
        });


        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChats);

    });
});
