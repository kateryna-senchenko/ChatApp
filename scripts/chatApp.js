define(function (require) {

    var EventBus = require('./eventbus');
    var eventBus = EventBus();

    var UserService = require('./userService');
    var userService = UserService(eventBus);

    var ChatRoom = require('./chatRoom');
    var chatRoom = ChatRoom("chat-app", eventBus, userService);

});