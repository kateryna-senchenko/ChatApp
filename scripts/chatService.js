var ChatService = function (eventbus, events, storage) {

    var _collectionName = "chats";

    var Chat = function (name, owner) {

        var _members = [owner];
        var _messages = [];

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


    var _addChat = function (owner, chatName) {

        if (typeof storage.findByPropertyValue(_collectionName, "name", chatName) !== "undefined") {

            var _chatExistMessage = "Chat with specified name is already exist";
            eventbus.post(events.CHAT_NOT_CREATED, new CreationChatEvent(_chatExistMessage));

        } else {

            var newChat = new Chat(chatName, owner);

            storage.add(_collectionName, newChat);

            console.log("Chat " + chatName + " was created by " + owner);

            eventbus.post(events.CHAT_MEMBERS_UPDATED, storage.getAll(_collectionName));
        }
    };

    var _addMember = function(chatName, newMember){

        var chat = storage.findByPropertyValue(_collectionName, "name", chatName);

        chat.joinChat(newMember);

        console.log("User " + newMember + " has joined chat " + chatName);

        eventbus.post(events.CHAT_MEMBERS_UPDATED, storage.getAll(_collectionName));
    };


    var _postMessage = function(author, message, chatName){

        var chat = storage.findByPropertyValue(_collectionName, "name", chatName);

        var newMessage = new Message(author, message);

        chat.postMessage(newMessage);

        console.log("User " + author + " has posted a message to chat " + chatName);

        eventbus.post(events.CHAT_MESSAGES_UPDATED, storage.getAll(_collectionName));
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
