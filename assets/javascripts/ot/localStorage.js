define("localStorage", function () {
    "use strict";
    function localStorage() {
        var deferred = undefined;
        var self = this;
        this.get = function (key) {
            console.log('get: ' +  (amplify.store(key)));
            return ko.utils.parseJson(amplify.store(key));

        };
        this.post = function (key, item) {
            amplify.store(key, ko.toJSON(item));
            return self.get(key);

        };
        this.put = function (key, item) {
            amplify.store(key, item);
            return self.get(key);
        };
    }
    return localStorage;
});