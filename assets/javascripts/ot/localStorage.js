define("localStorage", function () {
    "use strict";
    function localStorage() {
        this.get = function (key) {
            return ko.utils.parseJson(amplify.store(key));
        };
        this.post = function (key, item) {
            amplify.store(key, item);
            return ko.utils.parseJson(amplify.store(key));
        };
        this.put = function (key, item) {
            amplify.store(key, item);
            return ko.utils.parseJson(amplify.store(key));
        };
    }
    return localStorage;
});