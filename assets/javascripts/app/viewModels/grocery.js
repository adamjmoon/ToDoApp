define('viewmodels/grocery', ['viewmodels/todo', 'ot/model'], function (TodoViewModel, Model) {
    "use strict";
    function groceryListViewModel() {
    }

    groceryListViewModel.inherits(TodoViewModel);

    var self = groceryListViewModel.prototype;
    self.model = new Model('todo/grocery');
    self.name = 'grocery list';

    self.activate = function (showMode) {

        this.model.apiRoute = 'todo/grocery';
        this.get();

        if (showMode) {
            self.showMode(showMode)
        }
    };


    return groceryListViewModel;
})
;

