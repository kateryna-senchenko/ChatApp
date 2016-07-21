var Storage = function () {

    var _storage = {};


    var _getCollectionByName = function (name) {

        return _storage[name];
    };

    var _findObjectByPropertyValue = function (collection, id, idValue) {

        var collection = _getCollectionByName(collection);

        if (typeof collection === "undefined") {
            return null;
        }

        var item = null;
        for (var i = 0; i < collection.length; i++) {

            if (collection[i][id] === idValue) {
                item = collection[i];
                break;
            }

        }
        return item;
    };

    var _addObject = function (collection, value) {

        if (typeof _storage[collection] === "undefined") {
            _storage[collection] = [];
        }

        _storage[collection].push(value);
    };

    return {
        "getAll": _getCollectionByName,
        "findByPropertyValue": _findObjectByPropertyValue,
        "add": _addObject
    };
};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
    return Storage;
});
