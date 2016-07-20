var ChatService = require('../scripts/chatService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');

var eb = EventBus();
var events = require('../scripts/chatEvents');
var storage = Storage();
var chatService = ChatService(eb, events, storage);

describe('Test chat creation', function() {

    it('Fail to create new chats', function () {

        var collectionName = "chats";
        var key = "name";

        eb.subscribe(events.CHAT_IS_CREATED, chatService.addChat);

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


        eb.subscribe(events.CHAT_UPDATED, function (e) {
            deliveredFirst = (nameFirst === e.name);
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.CHAT_IS_CREATED, firstChatData);


        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);



        var nameSecond = "coffeetime";
        var deliveredSecond = false;

        eb.subscribe(events.CHAT_UPDATED, function (e) {
            deliveredSecond = (nameSecond === e.name);
        });


        var secondChatData = {
            name: nameSecond,
            members: [userAlice]
        };

        eb.post(events.CHAT_IS_CREATED, secondChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameSecond).name).is(nameSecond);

    });


    it("Creation chats with two identical names does not fail", function () {

        var collectionName = "chats";
        var key = "name";

        eb.subscribe(events.CHAT_IS_CREATED, chatService.addChat);

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


        eb.subscribe(events.CHAT_UPDATED, function (e) {
            deliveredFirst = (nameFirst === e.name);
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.CHAT_IS_CREATED, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChats);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);

        var deliveredSecond = false;

        var messageSecond = "Chat with specified name is already exist";

        eb.subscribe(events.CHAT_NOT_CREATED, function (e) {
            deliveredSecond = (messageSecond === e.message);
        });


        eb.post(events.CHAT_IS_CREATED, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChats);

    });
});
