define("ot/model",['OT'], function (OT) {
    "use strict";
    function Model(route) {
        var self = this;
        self.apiRoute = route;
    }

    Model.prototype.get = function () {
            return OT.DataStore.get(self.apiRoute);
        };
    Model.prototype.post = function (data) {
            return OT.DataStore.post(self.apiRoute, data);
        };
    Model.prototype.put = function (data) {
            return OT.DataStore.put(self.apiRoute, data);
        };

    return model;
});