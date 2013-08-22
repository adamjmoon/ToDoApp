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