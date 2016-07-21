define(function (require) {

    var EventBus = require('./eventbus');
    var eventBus = new EventBus();

    var chatEvents = require('./chatEvents');

    var Storage = require('./storage');
    var storage = new Storage();

    var UserService = require('./userService');
    var userService = new UserService(eventBus, chatEvents, storage);

    var ChatService = require('./chatService');
    var chatService = new ChatService(eventBus, chatEvents, storage);

    var ChatRoom = require('./chatRoom');
    var chatRoom = new ChatRoom("chat-app", eventBus, chatEvents, userService, chatService);


});