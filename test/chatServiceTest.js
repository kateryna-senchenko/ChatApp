var ChatService = require('../scripts/chatService');
var EventBus = require('../scripts/eventbus');
var Storage = require('../scripts/storage');
var unitjs = require('unit.js');
var eb = new EventBus();
var events = require('../scripts/chatEvents');
var storage = new Storage();
var chatService = new ChatService(eb, events, storage);

describe('Chat service should', function () {

    eb.subscribe(events.ATTEMPT_TO_CREATE_CHAT, chatService.addChat);
    eb.subscribe(events.ATTEMPT_TO_ADD_MEMBER, chatService.addMember);
    eb.subscribe(events.ATTEMPT_TO_LEAVE_CHAT, chatService.removeMember);
    eb.subscribe(events.ATTEMPT_TO_POST_MESSAGE, chatService.postMessage);

    it('Create new chats', function () {

        var collectionName = "chats";
        var key = "name";

        var existingChatsCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChatsCount = 0;
        } else {
            existingChatsCount = storage.getAll(collectionName).length;
        }


        var nameFirst = "abrakadabra";

        var userAlice = {
            "nickname": "Alice",
            "password": "formwonderland"
        };
        var deliveredFirst = false;


        eb.subscribe(events.CHAT_IS_CREATED, function (updatedChats) {
            for (var i = 0; i < updatedChats.length; i++) {
                if (updatedChats[i].name === nameFirst) {
                    deliveredFirst = true;
                    break;
                }
            }
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);


        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChatsCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);


        var nameSecond = "coffee time";
        var deliveredSecond = false;

        eb.subscribe(events.CHAT_IS_CREATED, function (updatedChats) {
            for (var i = 0; i < updatedChats.length; i++) {
                if (updatedChats[i].name === nameSecond) {
                    deliveredSecond = true;
                    break;
                }
            }
        });


        var secondChatData = {
            name: nameSecond,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, secondChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChatsCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameSecond).name).is(nameSecond);

    });


    it("Fail to create chats with identical names", function () {

        var collectionName = "chats";
        var key = "name";

        var existingChatsCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChatsCount = 0;
        } else {
            existingChatsCount = storage.getAll(collectionName).length;
        }


        var nameFirst = "follow the white rabbit";

        var userAlice = {
            "nickname": "Alice",
            "password": "formwonderland"
        };
        var deliveredFirst = false;


        eb.subscribe(events.CHAT_IS_CREATED, function (updatedChats) {
            for (var i = 0; i < updatedChats.length; i++) {
                if (updatedChats[i].name === nameFirst) {
                    deliveredFirst = true;
                    break;
                }
            }
        });


        var firstChatData = {
            name: nameFirst,
            members: [userAlice]
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(++existingChatsCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);

        var deliveredSecond = false;

        var messageSecond = "Specified name is not available";

        eb.subscribe(events.CHAT_CREATION_FAILED, function (e) {
            deliveredSecond = (messageSecond === e.message);
        });


        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredSecond).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChatsCount);

    });


    it("Trim chat name", function () {

        var collectionName = "chats";
        var key = "name";

        var existingChatsCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChatsCount = 0;
        } else {
            existingChatsCount = storage.getAll(collectionName).length;
        }

        var nameFirst = "Boo";


        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.number(storage.getAll(collectionName).length).is(++existingChatsCount);
        unitjs.string(storage.findByPropertyValue(collectionName, key, nameFirst).name).is(nameFirst);

        var deliveredFirst = false;
        var messageFirst = "Specified name is not available";

        var nameSecond = " Boo  ";
        var secondChatData = {
            name: nameSecond
        };


        eb.subscribe(events.CHAT_CREATION_FAILED, function (e) {
            deliveredFirst = (messageFirst === e.message);
        });


        eb.post(events.ATTEMPT_TO_CREATE_CHAT, secondChatData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChatsCount);

    });

    it("Fail to create chat if chat name is empty", function () {

        var collectionName = "chats";

        var existingChatsCount;

        if (typeof storage.getAll(collectionName) === "undefined") {
            existingChatsCount = 0;
        } else {
            existingChatsCount = storage.getAll(collectionName).length;
        }

        var nameFirst = "";
        var firstChatData = {
            name: nameFirst
        };

        var deliveredFirst = false;
        var messageFirst = "Chat name should not be empty";

        eb.subscribe(events.CHAT_CREATION_FAILED, function (e) {
            deliveredFirst = (messageFirst === e.message);
        });

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        this.timeout(1000);
        unitjs.bool(deliveredFirst).isTrue();
        unitjs.number(storage.getAll(collectionName).length).is(existingChatsCount);
    });

    it("Add member to chat", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "Protect The Mockingbirds";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var existingMembersCount;

        if (typeof chat.members === "undefined") {
            existingMembersCount = 0;
        } else {
            existingMembersCount = chat.members.length;
        }

        var userNickname = "Scout";
        var secondChatData = {
            chatName: chat.name,
            user: userNickname
        };

        var userAdded = false;

        eb.post(events.ATTEMPT_TO_ADD_MEMBER, secondChatData);

        for (var i = 0; i < chat.members.length; i++) {
            if (chat.members[i] === userNickname) {
                userAdded = true;
                break;
            }
        }


        this.timeout(1000);
        unitjs.number(chat.members.length).is(++existingMembersCount);
        unitjs.bool(userAdded).isTrue();


    });

    it("Fail to add member if he/she is already in the chat", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "Pilgrims to Vegas";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var userNickname = "Boo91";
        var secondChatData = {
            chatName: chat.name,
            user: userNickname
        };

        eb.post(events.ATTEMPT_TO_ADD_MEMBER, secondChatData);

        var existingMembersCount;

        if (typeof chat.members === "undefined") {
            existingMembersCount = 0;
        } else {
            existingMembersCount = chat.members.length;
        }

        eb.post(events.ATTEMPT_TO_ADD_MEMBER, secondChatData);

        this.timeout(1000);
        unitjs.number(chat.members.length).is(existingMembersCount);

    });

    it("Remove member from chat", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "Free Parrots";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var userNickname = "Jem";
        var secondChatData = {
            chatName: chat.name,
            user: userNickname
        };

        eb.post(events.ATTEMPT_TO_ADD_MEMBER, secondChatData);

        var existingMembersCount;

        if (typeof chat.members === "undefined") {
            existingMembersCount = 0;
        } else {
            existingMembersCount = chat.members.length;
        }

        var userRemoved = false;

        var thirdChatData = {
            chat: chat,
            user: userNickname
        };

        eb.post(events.ATTEMPT_TO_LEAVE_CHAT, thirdChatData);

        var members = storage.findByPropertyValue(_collectionName, "name", nameFirst).members;

        if (members.length === 0) {
            userRemoved = true;
        } else {
            for (var i = 0; i < members.length; i++) {
                if (members[i] === userNickname) {
                    userRemoved = false;
                    break;
                } else {
                    userRemoved = true;
                }
            }
        }


        this.timeout(1000);
        unitjs.number(chat.members.length).is(--existingMembersCount);
        unitjs.bool(userRemoved).isTrue();


    });

    it("Fail to remove member if there is no such member in the chat", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "Water for Elephants";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var userNickname = "Jacob";
        var secondChatData = {
            chat: chat,
            user: userNickname
        };


        var existingMembersCount;

        if (typeof chat.members === "undefined") {
            existingMembersCount = 0;
        } else {
            existingMembersCount = chat.members.length;
        }

        eb.post(events.ATTEMPT_TO_LEAVE_CHAT, secondChatData);


        this.timeout(1000);
        unitjs.number(chat.members.length).is(existingMembersCount);

    });

    it("Post message to chat", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "The Red-Headed League";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var userNickname = "Mr.Fox";
        var secondChatData = {
            chatName: chat.name,
            user: userNickname
        };

        eb.post(events.ATTEMPT_TO_ADD_MEMBER, secondChatData);

        var message = "Hello there!";

        var existingMessagesCount;

        if (typeof chat.messages === "undefined") {
            existingMessagesCount = 0;
        } else {
            existingMessagesCount = chat.messages.length;
        }

        var thirdData = {
            chatName: chat.name,
            author: userNickname,
            message: message
        };

        var messageAdded = false;

        eb.post(events.ATTEMPT_TO_POST_MESSAGE, thirdData);

        for (var i = 0; i < chat.messages.length; i++) {
            if ((chat.messages[i].message === message) && (chat.messages[i].author === userNickname)) {
                messageAdded = true;
                break;
            }
        }

        this.timeout(1000);
        unitjs.number(chat.messages.length).is(++existingMessagesCount);
        unitjs.bool(messageAdded).isTrue();


    });

    it("Fail to post message by nonmember", function () {

        var _collectionName = "chats";
        var key = "name";

        var nameFirst = "Ghost Hunters";
        var firstChatData = {
            name: nameFirst
        };

        eb.post(events.ATTEMPT_TO_CREATE_CHAT, firstChatData);

        var chat = storage.findByPropertyValue(_collectionName, "name", nameFirst);

        var userNickname = "Casper";

        var message = "Hello there!";

        var existingMessagesCount;

        if (typeof chat.messages === "undefined") {
            existingMessagesCount = 0;
        } else {
            existingMessagesCount = chat.messages.length;
        }

        var secondData = {
            chatName: chat.name,
            author: userNickname,
            message: message
        };


        eb.post(events.ATTEMPT_TO_POST_MESSAGE, secondData);


        this.timeout(1000);
        unitjs.number(chat.messages.length).is(existingMessagesCount);


    });


});
