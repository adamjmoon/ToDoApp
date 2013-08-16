define("models/workTodo",['ot/model'], function (Model) {
    "use strict";
    function WorkTodoModel(route) {
       this.apiRoute = 'workTodo';
    }
    WorkTodoModel.inherits(Model);

    return WorkTodoModel;
});
