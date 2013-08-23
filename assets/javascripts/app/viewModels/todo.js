define('viewmodels/todo', ['todo', 'ot/model', 'plugins/router'], function (Todo, Model, router) {
    "use strict";
    function todoViewModel() {

    }

    var self = todoViewModel.prototype;
    self.model = new Model();


    self.current = ko.observable();
    self.showMode = ko.observable('all');
    self.name = 'todos';
    self.todos = ko.observableArray([]);


    self.get = function () {
        self.todos((ko.utils.arrayMap(self.model.get() || [], function (todo) {
            return new Todo(todo.title, todo.completed);
        })));
        console.log(self.todos());
    }



    self.activate = function (showMode) {
        self.model.setRoute('todo/basic');
        this.get();
        if (showMode) {
            self.showMode(showMode);
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

    // add a new todo, when enter key is pressed
    self.add = function () {
        var current = self.current().trim();
        if (current) {
            self.todos.push(new Todo(current, false));
            self.current('');
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
        return ko.utils.unwrapObservable(count) === 1 ? ' item ' : ' items ';
    };


    self.maxHeight = window.innerHeight - 200;

    ko.computed(function () {
        // store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
        self.model.put(ko.toJSON(self.todos)
        )
        ;
    }).extend({
            throttle: 1000
        }); // save at most once per second


    return todoViewModel;
});