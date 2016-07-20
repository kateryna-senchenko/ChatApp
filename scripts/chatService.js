var ChatService = function (eventbus, events, storage) {

    var _collectionName = "chats";


    var Chat = function (name, owner) {

        var _members = [];

        var _messages = [];

        _members.push(owner);


        var _joinChat = function (user) {
            _members.push(user);
        };

        var _postMessage = function (message) {
            _messages.push(message);
        };

        return {
            "name": name,
            "members": _members,
            "messages": _messages,
            "joinChat": _joinChat,
            "postMessage": _postMessage
        }
    };


    var Message = function (author, message) {
      return {"author": author,
            "message": message}
    };

    var CreationChatEvent = function (message) {
        this.message = message;
        return this.message;
    };


    var _addChat = function (chatData) {

        if (typeof storage.findByPropertyValue(_collectionName, "name", chatData.name) !== "undefined") {

            var _chatExistMessage = "Chat with specified name is already exist";
            eventbus.post(events.CHAT_NOT_CREATED, new CreationChatEvent(_chatExistMessage));


        } else {

            var newChat = new Chat(chatData.name, chatData.owner);

            storage.add(_collectionName, newChat);

            console.log("Created chat " + chatData.name);

            eventbus.post(events.CHAT_UPDATED, newChat);
        }
    };

    var _addMember = function(chatData){

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.name);

        if(typeof chat === "undefined"){

            var chatNotFoundMessage = "Chat with specified name does not exist";
            eventbus.post(events.JOINING_CHAT_FAIL, new CreationChatEvent(chatNotFoundMessage));
        } else {
            chat.joinChat(chatData.user);

            console.log("User " + chatData.user.nickname + " has joined chat " + chatData.name);

            eventbus.post(events.CHAT_UPDATED, chat);
        }
    };

    var _postMessage = function(chatData){

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        var newMessage = new Message(chatData.author, chatData.message);

        chat.postMessage(newMessage);

        console.log("User " + chatData.author.nickname + " has posted a message to chat " + chatData.chatName);

        var updatedChatData = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        eventbus.post(events.CHAT_UPDATED, updatedChatData);
    };


    return {
        "addChat": _addChat,
        "addMember": _addMember,
        "postMessage": _postMessage
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return ChatService;
});
