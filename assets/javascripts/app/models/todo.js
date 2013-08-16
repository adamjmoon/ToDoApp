define("todoModel",['ot/model'], function (Model) {
    "use strict";
    function todoModel(route) {
       this.apiRoute = 'todo';
    }
    todoModel.inherits(Model);

    return todoModel;
});