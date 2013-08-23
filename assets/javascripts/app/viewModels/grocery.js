define('viewmodels/grocery', ['viewmodels/todo', 'ot/model'], function (TodoViewModel, Model) {
    "use strict";
    function groceryListViewModel() {
    }

    groceryListViewModel.inherits(TodoViewModel);

    var self = groceryListViewModel.prototype;
    self.name = 'grocery list';

    self.activate = function (showMode) {

        self.model.setRoute('todo/grocery');
        self.get();

        if (showMode) {
            self.showMode(showMode)
        }
    };


    return groceryListViewModel;
})
;

