define("OT", ['util', 'bindingHandlers', 'dataservice'], function (Util, BindingHandlers,dataservice) {

    var ot = {
        Util:  new Util(),
        BindingHandlers: new BindingHandlers(),
        DataService: new dataservice()
    }

    window.OT = ot;
    return ot;
});