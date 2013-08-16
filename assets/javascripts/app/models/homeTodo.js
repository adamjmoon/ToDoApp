define("models/homeTodo",['ot/model'], function (Model) {
    "use strict";
    function todoModel(route) {
       this.apiRoute = 'homeTodo';
    }
    todoModel.inherits(Model);

    return todoModel;
});