var ChatService = function (eventbus, events, storage) {

    var _collectionName = "chats";


    var Chat = function (id, name) {

        var _members = [];

        var _messages = [];

        var _addMember = function (user) {
            _members.push(user);
        };

        var _removeMember = function (user) {
            _members.pop(user);
        };

        var _addMessage = function (message) {
            _messages.push(message);
        };

        return {
            "id": id,
            "name": name,
            "members": _members,
            "messages": _messages,
            "addMember": _addMember,
            "removeMember": _removeMember,
            "addMessage": _addMessage
        }
    };


    var Message = function (author, message) {
        return {
            "author": author,
            "message": message
        }
    };

    var CreationChatEventTemplate = function (message) {
        this.message = message;
        return this.message;
    };


    var _addChat = function (chatData) {

        chatData.name = chatData.name.trim();

        if (chatData.name.length === 0) {

            var _invalidInputMessage = "Chat name should not be empty";
            eventbus.post(events.CHAT_CREATION_FAILED, new CreationChatEventTemplate(_invalidInputMessage));

        } else if (storage.findByPropertyValue(_collectionName, "name", chatData.name) !== null) {

            var _chatExistMessage = "Specified name is not available";
            eventbus.post(events.CHAT_CREATION_FAILED, new CreationChatEventTemplate(_chatExistMessage));


        } else {

            var newChat = new Chat(Date.now(), chatData.name);

            storage.add(_collectionName, newChat);

            console.log("Created chat " + chatData.name);

            eventbus.post(events.CHAT_IS_CREATED, storage.getAll(_collectionName));
        }
    };

    var _addMember = function (chatData) {

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        for (var i = 0; i < chat.members.length; i++) {
            if (chatData.user === chat.members[i]) {
                console.log(chatData.user + " is already a member");
                return;
            }
        }

        chat.addMember(chatData.user);
        console.log("User " + chatData.user + " has joined chat " + chat.name);

        var updatedChatData = {
            chat: chat,
            user: chatData.user
        };

        eventbus.post(events.MEMBER_IS_ADDED, updatedChatData);

    };

    var _removeMember = function (chatData) {

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.chat.name);

        if (chat.members.length === 0) {
            console.log("There is no member" + chatData.user + " in chat " + chatData.chat.name);
            return;
        } else {
            for (var i = 0; i < chat.members.length; i++) {
                if (chatData.user === chat.members[i]) {
                    chat.removeMember(chatData.user);
                    console.log("User " + chatData.user + " has left chat " + chat.name);
                    return;
                }
            }
            console.log("There is no member" + chatData.user + " in chat " + chatData.chat.name);
        }
    };

    var _postMessage = function (chatData) {

        var chat = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);

        var newMessage = new Message(chatData.author, chatData.message);

        if (chat.members.length === 0) {
            console.log("User " + chatData.author + " is not a member of chat " + chatData.chatName);
            return;
        } else {
            for (var i = 0; i < chat.members.length; i++) {
                if (chatData.author === chat.members[i]) {
                    chat.addMessage(newMessage);
                    console.log("User " + chatData.author + " has posted a message to chat " + chatData.chatName);
                    var updatedChatData = storage.findByPropertyValue(_collectionName, "name", chatData.chatName);
                    eventbus.post(events.CHAT_UPDATED, updatedChatData);
                    return;
                }
            }
            console.log("User " + chatData.author + " is not a member of chat " + chatData.chatName);
        }

    };

    var _getChatByName = function (name) {

        return storage.findByPropertyValue(_collectionName, "name", name);
    };

    var _getAllChats = function () {

        return storage.getAll(_collectionName);
    };

    return {
        "addChat": _addChat,
        "postMessage": _postMessage,
        "addMember": _addMember,
        "removeMember": _removeMember,
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
