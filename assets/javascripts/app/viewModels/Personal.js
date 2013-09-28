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

