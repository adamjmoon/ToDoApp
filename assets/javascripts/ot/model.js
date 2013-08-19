define("ot/model",['OT'], function (OT) {
    "use strict";
    function Model(route) {
        var self = this;
        self.apiRoute = route;
    }

    Model.prototype.get = function get() {
            return OT.DataService.get(self.apiRoute);
        };
    Model.prototype.post = function post(data) {
            return OT.DataService.post(self.apiRoute, data);
        };
    Model.prototype.put = function put(data) {
            return OT.DataService.put(self.apiRoute, data);
        };

    return Model;
});