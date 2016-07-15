define(function (require) {


    var EventBus = require('./eventbus');
    var eventBus = EventBus();

    var RegistrationComponent = require('./registrationComponent');
    var registrationComponent = RegistrationComponent("registration", eventBus);

    registrationComponent.init();

    var UserService = require('./userService');
    var userService = UserService(eventBus);

    var UserListComponent = require('./userListComponent');
    var userListComponent = UserListComponent("user-list");

    eventBus.subscribe("addUser", userService.addUser);
    eventBus.subscribe("failRegistration", registrationComponent.showError);
    eventBus.subscribe("displayUsers", userListComponent.init);

});		