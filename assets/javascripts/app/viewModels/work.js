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

