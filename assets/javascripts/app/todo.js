define('todo', function () {
    "use strict";
    function todo(title, completed) {
        this.title = ko.observable(title);
        this.completed = ko.observable(completed);
        this.editing = ko.observable(false);
    };

    return todo;
});

