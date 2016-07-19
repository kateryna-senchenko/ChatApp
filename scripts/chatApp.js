define(function (require) {

    var EventBus = require('./eventbus');
    var eventBus = EventBus();

    var userRegistrationEvents = require('./userRegistrationEvents');

    var Storage = require('./storage');
    var storage = Storage();

    var UserService = require('./userService');
    var userService = UserService(eventBus, userRegistrationEvents, storage);

    var ChatRoom = require('./chatRoom');
    var chatRoom = ChatRoom("chat-app", eventBus, userRegistrationEvents, userService);


});