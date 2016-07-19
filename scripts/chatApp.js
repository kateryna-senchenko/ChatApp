define(function (require) {

    var EventBus = require('./eventbus');
    var eventBus = EventBus();

    var chatEvents = require('./chatEvents');

    var Storage = require('./storage');
    var storage = Storage();

    var UserService = require('./userService');
    var userService = UserService(eventBus, chatEvents, storage);

    var ChatRoom = require('./chatRoom');
    var chatRoom = ChatRoom("chat-app", eventBus, chatEvents, userService);


});