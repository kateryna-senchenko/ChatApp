/*requirejs.config({
    baseUrl: 'node_modules/jquery/dist',
    paths: {
        jquery: 'jquery'
    }
});*/

define(function (require) {

    var EventBus = require('./eventbus');
    var eventBus = EventBus();

    var UserRegistrationEvents = require('./userRegistrationEvents');
    var userRegistrationEvents = UserRegistrationEvents();

    var UserService = require('./userService');
    var userService = UserService(eventBus, userRegistrationEvents);

    var ChatRoom = require('./chatRoom');
    var chatRoom = ChatRoom("chat-app", eventBus, userRegistrationEvents, userService);


});