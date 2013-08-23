define('viewmodels/chores', ['viewmodels/todo', 'ot/model', 'todo'], function (TodoViewModel, Model, Todo) {
    "use strict";
    function choresTodoViewModel() {
    }

    choresTodoViewModel.inherits(TodoViewModel);

    choresTodoViewModel.prototype.name = 'chores todos';

    choresTodoViewModel.prototype.activate = function (showMode) {
        this.model.setRoute('todo/chores');
        this.get();

        if (showMode) {
            choresTodoViewModel.prototype.showMode(showMode)
        }
    };

    return choresTodoViewModel;
});

