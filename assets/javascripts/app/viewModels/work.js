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

