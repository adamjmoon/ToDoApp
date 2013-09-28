define("ot/model", ['OT'], function (OT) {
    "use strict";
    function Model(route, observe, isList, subscribeCallback) {
        var self = this;
        this.apiRoute = route || '';
        this.observe = observe;
        this.subscribeCallback = subscribeCallback;
        this.isList = isList;



        this.get = function get(route,callback) {

            var result = OT.DataService.get(route);
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

        this.post = function post(route, data) {
            return OT.DataService.post(route, data);
        };
        this.put = function put(route, data) {
            return OT.DataService.put(route, data);
        };

        this.mapToObservableList = function (array) {
            var list = ko.observableArray([]);
            _.map(array, function (dataItem) {
                list.push(self.mapToObservables(dataItem));
            });
            return list;
        };

        this.mapToObservables = function (dataItem) {
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