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
define('todo', function () {
    "use strict";
    function todo(title, completed) {
        this.title = ko.observable(title);
        this.completed = ko.observable(completed);
        this.editing = ko.observable(false);
    };

    return todo;
});


define('viewmodels/grocery', ['viewmodels/todo', 'ot/model'], function (TodoViewModel, Model) {
    "use strict";
    function groceryListViewModel() {
    }

    groceryListViewModel.inherits(TodoViewModel);

    var self = groceryListViewModel.prototype;
    self.model = new Model('todo/grocery');
    self.name = 'grocery list';

    self.activate = function (showMode) {

        this.model.apiRoute = 'todo/grocery';
        this.get();

        if (showMode) {
            self.showMode(showMode)
        }
    };


    return groceryListViewModel;
})
;


define('viewmodels/shell', ['plugins/router', 'durandal/app'], function (router, app) {

    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Todo', moduleId: 'viewmodels/todo', nav: false },
                { route: 'todo(/:showMode)', title: 'Todo', moduleId: 'viewmodels/todo', hash: '#todo',nav: true },
                { route: 'work(/:showMode)', title: 'Work', moduleId: 'viewmodels/work', hash: '#work', nav: true },
                { route: 'grocery(/:showMode)', title: 'Grocery List', moduleId: 'viewmodels/grocery', hash: '#grocery', nav: true }
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
define('viewmodels/todo', ['todo', 'ot/model', 'plugins/router'], function (Todo, Model, router) {
    "use strict";
    function todoViewModel() {

    }

    todoViewModel.prototype.model= new Model();
    todoViewModel.prototype.setModelRoute = function (route) {
        this.model.apiRoute = route;
    };


    todoViewModel.prototype.current = ko.observable();
    todoViewModel.prototype.showMode = ko.observable('all');
    todoViewModel.prototype.name = 'todos';
    todoViewModel.prototype.todos = ko.observableArray([]);

    todoViewModel.prototype.get = function () {
        this.todos(ko.utils.arrayMap(todoViewModel.prototype.model.get() || [], function (todo) {
            return new Todo(todo.title, todo.completed);
        }));
    }
    todoViewModel.prototype.update = function () {
        this.model.post(ko.toJSON(this.todos()));
    };


    todoViewModel.prototype.activate = function (showMode) {
        this.model.apiRoute = 'todo/basic';
        this.get();
        if (showMode) {
            todoViewModel.prototype.showMode(showMode);
        }
    };

    todoViewModel.prototype.filteredTodos = ko.computed(function () {
        switch (todoViewModel.prototype.showMode()) {
            case 'active':
                return todoViewModel.prototype.todos().filter(function (todo) {
                    return !todo.completed();
                });
            case 'completed':
                return todoViewModel.prototype.todos().filter(function (todo) {
                    return todo.completed();
                });
            default:
                return todoViewModel.prototype.todos();
        }
    });

    // add a new todo, when enter key is pressed
    todoViewModel.prototype.add = function () {
        var current = todoViewModel.prototype.current().trim();
        if (current) {
            todoViewModel.prototype.todos.push(new Todo(current, false));
            todoViewModel.prototype.update();
            todoViewModel.prototype.current('');
        }
    };

    // remove a single todo
    todoViewModel.prototype.remove = function (todo) {
        todoViewModel.prototype.todos.remove(todo);
        todoViewModel.prototype.update();
    };

    // remove all completed todos
    todoViewModel.prototype.removeCompleted = function () {
        todoViewModel.prototype.todos.remove(function (todo) {
            return todo.completed();
        });
        todoViewModel.prototype.update();
    };

    // edit an item
    todoViewModel.prototype.editItem = function (item) {
        item.editing(true);
    };

    // stop editing an item.  Remove the item, if it is now empty
    todoViewModel.prototype.stopEditing = function (item) {
        item.editing(false);
        todoViewModel.prototype.update();

        if (!item.title().trim()) {
            todoViewModel.prototype.remove(item);
        }
    };

    // count of all completed todos
    todoViewModel.prototype.completedCount = ko.computed(function () {
        return ko.utils.arrayFilter(todoViewModel.prototype.todos(),function (todo) {
            return todo.completed();
        }).length;
    });

    // count of todos that are not complete
    todoViewModel.prototype.remainingCount = ko.computed(function () {
        return todoViewModel.prototype.todos().length - todoViewModel.prototype.completedCount();
    });

    // writeable computed observable to handle marking all complete/incomplete
    todoViewModel.prototype.allCompleted = ko.computed({
        //always return true/false based on the done flag of all todos
        read: function () {
            return !todoViewModel.prototype.remainingCount();
        },
        // set all todos to the written value (true/false)
        write: function (newValue) {
            ko.utils.arrayForEach(todoViewModel.prototype.todos(), function (todo) {
                // set even if value is the same, as subscribers are not notified in that case
                todo.completed(newValue);
            });
            todoViewModel.prototype.update();
        }
    });

    // helper function to keep expressions out of markup
    todoViewModel.prototype.getLabel = function (count) {
        return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
    };


    todoViewModel.prototype.maxHeight = window.innerHeight - 200;


    return todoViewModel;
});
define('viewmodels/work', ['viewmodels/todo', 'ot/model', 'todo'], function (TodoViewModel, Model, Todo) {
    "use strict";
    function workTodoViewModel() {
    }

    workTodoViewModel.inherits(TodoViewModel);

    workTodoViewModel.prototype.name = 'work todos';


    workTodoViewModel.prototype.activate = function (showMode) {
        this.model.apiRoute = 'todo/work';
        this.get();

        if (showMode) {
            workTodoViewModel.prototype.showMode(showMode)
        }
    };

    return workTodoViewModel;
});

