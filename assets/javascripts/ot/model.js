define("ot/model", ['OT'], function (OT) {
    "use strict";
    function Model(route, observe, isList, subscribeCallback) {
        this.apiRoute = route || '';
        this.observe = observe;
        this.subscribeCallback = subscribeCallback;
        this.isList = isList;
        var self = this;

        self.init = function (data) {
            return self.put(data);
        }

        self.get = function get(callback) {

            var result = OT.DataService.get(self.apiRoute);
            if (self.observe) {
                if (self.isList) {
                    return self.mapToObservableList(result);
                }
                else {
                    return self.mapToObservables(result);
                }
            }
            else {
                return result;
            }


        };

        self.post = function post(data) {
            return OT.DataService.post(self.apiRoute, data);
        };
        self.put = function put(data) {
            return OT.DataService.put(self.apiRoute,data);
        };

        self.mapToObservableList = function (array) {
            var list = ko.observableArray([]);
            _.map(array, function (dataItem) {
                list.push(self.mapToObservables(dataItem));
            });
            return list;
        };

        self.mapToObservables = function (dataItem) {
            var obj = {};
            for (var prop in dataItem) {
                if (observe) {
                    obj[prop] = ko.observable(dataItem[prop]);
                    if (subscribeCallback) {
                        obj[prop].subscribe(new Function('newValue', "self.model.subscribeCallback('" + prop + "',newValue);"));
                    }
                }
                else {
                    obj[prop] = dataItem[prop];
                }
            }
            return obj;
        };
    }

    return Model;

})
;