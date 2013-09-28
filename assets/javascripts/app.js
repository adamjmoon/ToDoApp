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
                this.prototype.base = ParentClassOrObject.prototype;
            }
            else {
                //Pure Virtual Inheritance
                this.prototype = ParentClassOrObject;
                this.prototype.constructor = this;
                this.prototype.base = ParentClassOrObject;
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


define('viewmodels/personal', ['viewmodels/todo', 'ot/model', 'todo'], function (TodoViewModel, Model, Todo) {
    "use strict";
    function personalTodoViewModel() {
    }

    personalTodoViewModel.inherits(TodoViewModel);

    personalTodoViewModel.prototype.name('personal');

    personalTodoViewModel.prototype.activate = function (arg1, arg2) {
        var showMode, subList, subLists;

        subLists = ['grocery','clean','organize','outdoor'];

        if (this.base.showModes[arg1]) {
            showMode = arg1
        }
        else {
            subList = arg1
        }

        if (arg2 && this.base.showModes[arg2])
            showMode = arg2;

        this.base.activateChild('personal', showMode, 'personal', subList);
        this.base.setSubLists(subLists);
    };

    return personalTodoViewModel;
});


define('viewmodels/shell', ['plugins/router', 'durandal/app'], function (router, app) {

    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Todo', moduleId: 'viewmodels/todo', nav: false },
                { route: 'todo(/:showMode)', title: 'Todos', moduleId: 'viewmodels/todo', hash: '#todo',nav: true },
                { route: 'personal(/:subType)(/:showMode)', title: 'Personal', moduleId: 'viewmodels/personal', hash: '#personal',nav: true },
                { route: 'work(/:subType)(/:showMode)', title: 'Work', moduleId: 'viewmodels/work', hash: '#work', nav: true }


            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
define('viewmodels/todo', ['todo', 'ot/model'], function (Todo, Model) {
    "use strict";
    function todoViewModel() {
    }

    var self = todoViewModel.prototype;
    self['showModes'] = {active: true, completed: true, all: true};
    self.baseName = "todos";
    self.baseRoute = "todo";
    self.model = new Model();
    self.currentToDo = ko.observable();
    self.currentRoute = ko.observable('');

    self.currentRoute.subscribe(function (newRoute) {
        self.getTodos();
    });

    self.newSubList = ko.observable();
    self.showMode = ko.observable('all');
    self.name = ko.observable(self.baseName);
    self.todos = ko.observableArray([]);
    self.subLists = ko.observableArray([]);
    self.subList = ko.observable();

    // subscribe to subLists changes and save
    self.subLists.subscribe(function (subLists) {
        if (subLists && subLists.length > 0)
            self.model.put(self.name() + '/subLists', ko.toJSON(self.subLists));
    });

    self.setSubLists = function (subLists) {
        self.getSubLists(
            function (exists) {
                if (!exists) {
                    self.subLists((ko.utils.arrayMap(subLists || [], function (subList) {
                        return subList;
                    })));
                }
            }
        );
    }

    self.getSubLists = function (callback) {
        var data = self.model.get(self.name() + '/subLists');
        self.subLists((ko.utils.arrayMap(data || [], function (subList) {
            return subList;
        })));
        if (callback) {
            if (data && data.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
    };

    self.getTodos = function () {
        self.todos((ko.utils.arrayMap(self.model.get(self.currentRoute()) || [], function (todo) {
            return new Todo(todo.title, todo.completed);
        })));
    };

    self.activate = function (showMode) {
        self.currentRoute(self.baseRoute);
        self.name(self.baseName);
        self.subLists = ko.observableArray([]);
        if (showMode) {
            self.showMode(showMode);
        }
    };

    self.activateChild = function (name, showMode, route, subType) {
        if (name) {
            self.name(name);
        }

        if (route) {
            self.currentRoute(route + (subType ? '/' + subType : ''));
        }

        if (subType) {
            self.subList(subType);
        }
        else {
            self.subList('');
        }

        if (showMode) {
            self.showMode(showMode);
        }
        else {
            self.showMode('all');
        }
    };

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

    // add a new subList, when add subList button is pressed
    self.addSubList = function () {
        var newList = self.newSubList().trim();

        if (newList.length > 0) {
            self.subLists.push(newList);
            self.newSubList('');
        }
    };
    // add a new todo, when enter key is pressed
    self.add = function () {
        self.currentToDo(self.currentToDo().trim());
        if (self.currentToDo().length > 0) {
            self.todos.push(new Todo(self.currentToDo(), false));
            self.currentToDo('');
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

    // watches changes to self.todos if length > 0 after change persist changes for currentRoute
    ko.computed(function () {
        // store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
        if (self.todos().length > 0)
            self.model.put(self.currentRoute(), ko.toJSON(self.todos));
    }).extend({
            throttle: 1000
        }); // save at most once per second


    return todoViewModel;
});
define('viewmodels/work', ['viewmodels/todo', 'ot/model', 'todo'], function (TodoViewModel, Model, Todo) {
    "use strict";
    function workTodoViewModel() {
    }

    workTodoViewModel.inherits(TodoViewModel);
    workTodoViewModel.prototype.activate = function (arg1, arg2) {
        var showMode, subList;
        if (this.base.showModes[arg1]) {
            showMode = arg1
        }
        else {
            subList = arg1
        }

        if (arg2 && this.base.showModes[arg2])
            showMode = arg2;

        this.base.activateChild('work', showMode, 'work', subList);
        this.base.setSubLists(["pomodoro"]);
    };

    return workTodoViewModel;
});

