define("InMemory", function () {
    "use strict";
    function InMemory() {
        var self = this;
        this.Store = new function Store() {
            var self = this;
            this.get = function (key) {
                return self[key];
            };
            this.post = function (key, item) {
                self[key] = ko.utils.toJSON(item);
                return self[key];
            };
            this.put = function (key, item) {
                self[key] = ko.utils.toJSON(item);
                return self[key];
            };
        };

        this.get = function (key) {
            return ko.utils.parseJson(self.Store.get(key));
        };
        this.post = function (key, item) {
            return ko.utils.parseJson(self.Store.post(key, item));
        };
        this.put = function (key, item) {
            return ko.utils.parseJson(self.Store.post(key, item));
        };
    }

    return InMemory;
});