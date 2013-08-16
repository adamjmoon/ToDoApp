define("viewModelMap", function () {
    var viewModelMap = function () {};

    viewModelMap.prototype.map = function (dataItem, observe, subscribeCallback) {
        var viewModel = {};
        for (var prop in dataItem) {
            if (observe) {
                viewModel[prop] = ko.observable(dataItem[prop]);
                if (subscribeCallback) {
                    viewModel[prop].subscribe(new Function('newValue', "subscribeCallback('" + prop + "',newValue);"));
                }
            }
            else {
                viewModel[prop] = dataItem[prop];
            }
        }

        return viewModel;
    };

    return viewModelMap;
});
