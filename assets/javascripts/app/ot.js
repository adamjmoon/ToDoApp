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
                self[key] = ko.toJSON(item);
                return self[key];
            };
            this.put = function (key, item) {
                self[key] =ko.toJSON(item);
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
define("bindingHandlers", function () {
    function bindingHandlers() {
        "use strict";
        var ENTER_KEY = 13;

        // a custom binding to handle the enter key (could go in a separate library)
        ko.bindingHandlers.enterKey = {
            init: function (element, valueAccessor, allBindingsAccessor, data) {
                var wrappedHandler, newValueAccessor;

                // wrap the handler with a check for the enter key
                wrappedHandler = function (data, event) {
                    if (event.keyCode === ENTER_KEY) {
                        valueAccessor().call(this, data, event);
                    }
                };

                // create a valueAccessor with the options that we would want to pass to the event binding
                newValueAccessor = function () {
                    return {
                        keyup: wrappedHandler
                    };
                };

                // call the real event binding's init function
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
            }
        };

        // wrapper to hasfocus that also selects text and applies focus async
        ko.bindingHandlers.selectAndFocus = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                ko.bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
                ko.utils.registerEventHandler(element, 'focus', function () {
                    element.focus();
                });
            },
            update: function (element, valueAccessor) {
                ko.utils.unwrapObservable(valueAccessor()); // for dependency
                // ensure that element is visible before trying to focus
                setTimeout(function () {
                    ko.bindingHandlers.hasfocus.update(element, valueAccessor);
                }, 0);
            }
        };
    };

    return bindingHandlers;
});
define('dataservice', function () {
    function dataservice() {
        $.ajaxSetup({
            statusCode: {
                401: function () {

                    // Redirect the to the login page.
                    location.href = "/#login";
                }
            }
        });

        self.get = function (partialUrl) {
            var deferred = $.Deferred();
            sendRequest("GET", partialUrl, {}, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.post = function (partialUrl, data) {
            var deferred = $.Deferred();
            sendRequest("POST", partialUrl, data, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.put = function (partialUrl, data) {
            var deferred = $.Deferred();
            sendRequest("PUT", partialUrl, data, {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);
                }
            });
            return deferred.promise();
        };

        self.delete = function (partialUrl) {
            var deferred = $.Deferred();
            sendRequest("DELETE", partialUrl, "", {
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr, eventArgs) {
                    deferred.rejectWith(this, [xhr, eventArgs]);

                }
            });
            return deferred.promise();
        };

        var sendRequest = function (method, partialUrl, data, callbacks, async) {
            var url = '/capi' + partialUrl;
            var requestData = "";
            if (method != "GET") {
                requestData = config.packageData(data);
            }
            if (async === undefined) {
                async = true;
            }
            $.ajax({
                url: url,
                type: method,
                async: async,
                data: requestData,
                contentType: "application/json",
                success: function (response) {

                    if (typeof response == "string" && response !== "") {
                        response = JSON.parse(response);
                    }
                    if (callbacks && callbacks.success) callbacks.success(response);
                },
                error: function (xhr) {
                    if ($.disableErrors) {
                        return;
                    }
                    this.eventArgs = { handledError: false };
                    if (callbacks && callbacks.error) {
                        callbacks.error(xhr, this.eventArgs);
                    }

                    if (!this.eventArgs.handledError) {

                    }
                }
            });
        };
    }

    return dataservice;
});
define('errorlog', [],
    function () {
        function errorlog() {
            var log = function (uri, message, timeout) {
                if (!timeout) {
                    timeout = 0;
                }
                return sendRequest("POST", uri, { message: message }, timeout);
            };

            this.init = function () {
                config.init();
            };

            this.info = function (message, timeout) {
                return log("/log/info", message, timeout);
            };

            this.warning = function (message, timeout) {
                return log("/log/warning", message, timeout);
            };

            this.error = function (message, timeout) {
                return log("/log/error", message, timeout);
            };

            this.critical = function (message, timeout) {
                return log("/log/critical", message, timeout);
            };
        }

        return errorlog;
    });
define("localStorage", function () {
    "use strict";
    function localStorage() {
        var deferred = undefined;
        var self = this;
        this.get = function (key) {
            console.log(key);
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
define("ot/model", ['OT'], function (OT) {
    "use strict";
    function Model(route, observe, isList, subscribeCallback) {
        var self = this;
        this.apiRoute = route || '';
        this.observe = observe;
        this.subscribeCallback = subscribeCallback;
        this.isList = isList;


        this.init = function (data) {
            return self.put(data);
        }

        this.setRoute = function (route) {
            self.apiRoute = route;
        };

        this.get = function get(callback) {

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

        this.post = function post(data) {
            return OT.DataService.post(self.apiRoute, data);
        };
        this.put = function put(data) {
            return OT.DataService.put(self.apiRoute, data);
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
define("util", function () {
    function util() {
        "use strict";

        // Inheritance Helpers
        if (typeof Object.create === "undefined") {
            Object.create = function (o) {
                function F() {
                }

                F.prototype = o;
                return new F();
            };
        }

        Function.prototype.inherits = function (ParentClassOrObject) {
            if (ParentClassOrObject.constructor == Function) {
                //Normal Inheritance
                this.prototype = new ParentClassOrObject();
                this.prototype.constructor = this;
                this.prototype.parent = ParentClassOrObject.prototype;
            }
            else {
                //Pure Virtual Inheritance
                this.prototype = ParentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.parent = ParentClassOrObject;
            }
            return this;
        };

        Function.prototype.extends = function (parent) {
            if (parent instanceof Function) {
                var parentInstance = new parent();
                for (var key in parentInstance) {
                    this[key] = parentInstance[key];
                }
            }
            else {
                for (var key in parent) {
                    this[key] = parent[key];
                }
            }

            return this;
        }
    }

    return util;
})
;


define("OT", ['util', 'bindingHandlers', 'dataservice'], function (Util, BindingHandlers,dataservice) {

    var util  = new Util();
    var bindingHandlers = new BindingHandlers();
    var dataService = new dataservice();

    var ot = {
        Util: util,
        BindingHandlers: util,
        DataService: dataService
    }
    window.OT = ot;
    return ot;

});