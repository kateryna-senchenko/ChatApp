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

        chatData.name = chatData.name.trim();

        if(chatData.name.length === 0){

            var _invalidInputMessage = "Chat name should not be empty";
            eventbus.post(events.CHAT_CREATION_FAILED, new CreationChatEvent(_invalidInputMessage));

        } else if (storage.findByPropertyValue(_collectionName, "name", chatData.name) !== null) {

            var _chatExistMessage = "Specified name is not available";
            eventbus.post(events.CHAT_CREATION_FAILED, new CreationChatEvent(_chatExistMessage));


        } else {

            var newChat = new Chat(chatData.name, chatData.owner);

            storage.add(_collectionName, newChat);

            console.log("Created chat " + chatData.name);

            eventbus.post(events.CHAT_IS_CREATED, newChat);
        }
    };


    var _postMessage = function(chatData){

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        var newMessage = new Message(chatData.author, chatData.message);

        chat.postMessage(newMessage);

        console.log("User " + chatData.author + " has posted a message to chat " + chatData.chatName);

        var updatedChatData = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        eventbus.post(events.CHAT_UPDATED, updatedChatData);
    };

    var _getChatByName = function(name){

        return storage.findByPropertyValue(_collectionName, "name", name);
    };

    var _getAllChats = function(){

        return storage.getAll(_collectionName);
    };

    return {
        "addChat": _addChat,
        "postMessage": _postMessage,
        "getChatByName": _getChatByName,
        "getAllChats": _getAllChats
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return ChatService;
});
