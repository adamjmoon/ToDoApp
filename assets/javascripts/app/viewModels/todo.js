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