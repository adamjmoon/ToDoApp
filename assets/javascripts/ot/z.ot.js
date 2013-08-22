define("OT", ['util', 'bindingHandlers', 'dataservice'], function (Util, BindingHandlers,dataservice) {

    var util  = new Util();
    var bindingHandlers = new BindingHandlers();
    var dataService = new dataservice();

    var ot = {
        Util: util,
        BindingHandlers: util,
        DataService: dataService
    }
    window.OT = ot;
    return ot;

});