define("OT", ['util', 'bindingHandlers'], function (Util, BindingHandlers) {

    var ot = function() {
        var self = this;
        this.Util =  new Util();
        this.BindingHandlers = new BindingHandlers();

    };

    return new ot();
});