define("viewModel", ["viewModelMap"], function (ViewModelMap) {
    function viewModel(){
        "use strict";
        this.observe = false;
        this.subscribe = undefined;
    }

    viewModel.prototype.observeAll = function(){
        "use strict";
         viewModel.observe = true;
    };

    viewModel.prototype.subscribeAll = function(){
        "use strict";
        viewModel.subscribe = function(property,newValue){

        }
    };

    viewModel.prototype.map = function (dataItem) {
        var viewModelMap = new ViewModelMap();
        return viewModelMap.map(dataItem, viewModel.observe, viewModel.subscribe);
    };

    return viewModel;
});