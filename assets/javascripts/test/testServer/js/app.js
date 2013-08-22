define("models/homeTodo",['ot/model'], function (Model) {
    "use strict";
    function todoModel(route) {
       this.apiRoute = 'homeTodo';
    }
    todoModel.inherits(Model);

    return todoModel;
});
define("todoModel",['ot/model'], function (Model) {
    "use strict";
    function todoModel(route) {
       this.apiRoute = 'todo';
    }
    todoModel.inherits(Model);

    return todoModel;
});
define("models/workTodo",['ot/model'], function (Model) {
    "use strict";
    function WorkTodoModel(route) {
       this.apiRoute = 'workTodo';
    }
    WorkTodoModel.inherits(Model);

    return WorkTodoModel;
});

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
define("listViewModel", ['viewModel'], function (ViewModel) {
    function listViewModel() {}

    listViewModel.prototype.map = function (array) {
        var list = ko.observableArray([]);
        var viewModel = new ViewModel();
        _.map(array, function (dataItem) {
            list.push(viewModel.map(dataItem));
        });
        return list;
    };

    return listViewModel;
});
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
            for (var key in parent) {
                this[key] = parent[key];
            }
            return this;
        }

    }

    return util;
})
;


define("viewModel", ["viewModelMap"], function (ViewModelMap) {
    function viewModel(){
        "use strict";
        this.observe = false;
        this.subscribe = undefined;
    }

    viewModel.prototype.observeAll = function(){
        "use strict";
         viewModel.observe = true;
    };

    viewModel.prototype.subscribeAll = function(){
        "use strict";
        viewModel.subscribe = function(property,newValue){

        }
    };

    viewModel.prototype.map = function (dataItem) {
        var viewModelMap = new ViewModelMap();
        return viewModelMap.map(dataItem, viewModel.observe, viewModel.subscribe);
    };

    return viewModel;
});
define("viewModelMap", function () {
    var viewModelMap = function () {};

    viewModelMap.prototype.map = function (dataItem, observe, subscribeCallback) {
        var viewModel = {};
        for (var prop in dataItem) {
            if (observe) {
                viewModel[prop] = ko.observable(dataItem[prop]);
                if (subscribeCallback) {
                    viewModel[prop].subscribe(new Function('newValue', "subscribeCallback('" + prop + "',newValue);"));
                }
            }
            else {
                viewModel[prop] = dataItem[prop];
            }
        }

        return viewModel;
    };

    return viewModelMap;
});

define("OT", ['util', 'bindingHandlers', 'dataservice'], function (Util, BindingHandlers,dataservice) {

    var ot = {
        Util:  new Util(),
        BindingHandlers: new BindingHandlers(),
        DataService: new dataservice()
    }

    window.OT = ot;
    return ot;
});
define('todo', function () {
    "use strict";
    function todo(title, completed) {
        this.title = ko.observable(title);
        this.completed = ko.observable(completed);
        this.editing = ko.observable(false);
    };

    return todo;
});


define('viewmodels/todo', ['todo','ot/model'], function (Todo, Model) {
    "use strict";
    function todoViewModel() {

    var self = this;

    self.model = new Model(route);

    self.todos = ko.observableArray(ko.utils.arrayMap(self.model.get() || self.model.put('[]'), function (todo) {
        return new Todo(todo.title, todo.completed);
    }));

    self.applyPlugins = function () {
        $("frame").niceScroll();
        self.nice = $("#frame").getNiceScroll();
    }

            // store the new todo value being entered
            self.current = ko.observable();
            self.showMode = ko.observable('all');

            self.filteredTodos = ko.computed(function () {
                switch (self.showMode()) {
                    case 'active':
                        return self.todos().filter(function (todo) {
                            return !todo.completed();
                        });
                    case 'completed':
                        return self.todos().filter(function (todo) {
                            return todo.completed();
                        });
                    default:
                        return self.todos();
                }
            });

            // add a new todo, when enter key is pressed
            self.add = function () {
                var current = self.current().trim();
                if (current) {
                    self.todos.push(new Todo(current));
                    self.current('');
                    self.nice.resize();
                }
            };

            // remove a single todo
            self.remove = function (todo) {
                self.todos.remove(todo);
            };

            // remove all completed todos
            self.removeCompleted = function () {
                self.todos.remove(function (todo) {
                    return todo.completed();
                });
            };

            // edit an item
            self.editItem = function (item) {
                item.editing(true);
            };

            // stop editing an item.  Remove the item, if it is now empty
            self.stopEditing = function (item) {
                item.editing(false);

                if (!item.title().trim()) {
                    self.remove(item);
                }
            };

            // count of all completed todos
            self.completedCount = ko.computed(function () {
                return ko.utils.arrayFilter(self.todos(),function (todo) {
                    return todo.completed();
                }).length;
            });

            // count of todos that are not complete
            self.remainingCount = ko.computed(function () {
                return self.todos().length - self.completedCount();
            });

            // writeable computed observable to handle marking all complete/incomplete
            self.allCompleted = ko.computed({
                //always return true/false based on the done flag of all todos
                read: function () {
                    return !self.remainingCount();
                },
                // set all todos to the written value (true/false)
                write: function (newValue) {
                    ko.utils.arrayForEach(self.todos(), function (todo) {
                        // set even if value is the same, as subscribers are not notified in that case
                        todo.completed(newValue);
                    });
                }
            });

            // helper function to keep expressions out of markup
            self.getLabel = function (count) {
                return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
            };

            // internal computed observable that fires whenever anything changes in our todos
            ko.computed(function () {
                // store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
                OT.dataProvider.put(self.listKey, ko.toJSON(self.todos));
            }).extend({
                throttle: 1000
            }); // save at most once per second

    }

    return todoViewModel;
});


define('viewmodels/work', ['todo','ot/model'], function (Todo, Model) {
    "use strict";
    function workTodoViewModel() {


    var self = this;
    self.route='todo';
    self.model = new Model(route);


    self.todos = ko.observableArray(ko.utils.arrayMap(self.model.get() || self.model.put('[]'), function (todo) {
        return new Todo(todo.title, todo.completed);
    }));

    self.applyPlugins = function () {
        $("frame").niceScroll();
        self.nice = $("#frame").getNiceScroll();
    }

    // store the new todo value being entered
    self.current = ko.observable();
    self.showMode = ko.observable('all');

    self.filteredTodos = ko.computed(function () {
        switch (self.showMode()) {
            case 'active':
                return self.todos().filter(function (todo) {
                    return !todo.completed();
                });
            case 'completed':
                return self.todos().filter(function (todo) {
                    return todo.completed();
                });
            default:
                return self.todos();
        }
    });

    // add a new todo, when enter key is pressed
    self.add = function () {
        var current = self.current().trim();
        if (current) {
            self.todos.push(new Todo(current));
            self.current('');
            self.nice.resize();
        }
    };

    // remove a single todo
    self.remove = function (todo) {
        self.todos.remove(todo);
    };

    // remove all completed todos
    self.removeCompleted = function () {
        self.todos.remove(function (todo) {
            return todo.completed();
        });
    };

    // edit an item
    self.editItem = function (item) {
        item.editing(true);
    };

    // stop editing an item.  Remove the item, if it is now empty
    self.stopEditing = function (item) {
        item.editing(false);

        if (!item.title().trim()) {
            self.remove(item);
        }
    };

    // count of all completed todos
    self.completedCount = ko.computed(function () {
        return ko.utils.arrayFilter(self.todos(),function (todo) {
            return todo.completed();
        }).length;
    });

    // count of todos that are not complete
    self.remainingCount = ko.computed(function () {
        return self.todos().length - self.completedCount();
    });

    // writeable computed observable to handle marking all complete/incomplete
    self.allCompleted = ko.computed({
        //always return true/false based on the done flag of all todos
        read: function () {
            return !self.remainingCount();
        },
        // set all todos to the written value (true/false)
        write: function (newValue) {
            ko.utils.arrayForEach(self.todos(), function (todo) {
                // set even if value is the same, as subscribers are not notified in that case
                todo.completed(newValue);
            });
        }
    });

    // helper function to keep expressions out of markup
    self.getLabel = function (count) {
        return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
    };

    // internal computed observable that fires whenever anything changes in our todos
    ko.computed(function () {
        // store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
        OT.dataProvider.put(self.listKey, ko.toJSON(self.todos));
    }).extend({
            throttle: 1000
        }); // save at most once per second

}

return workTodoViewModel;
})
;

