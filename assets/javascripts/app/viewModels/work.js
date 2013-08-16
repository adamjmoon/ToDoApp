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

