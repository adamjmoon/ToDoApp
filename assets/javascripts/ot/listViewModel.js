define("listViewModel", ['viewModel'], function (ViewModel) {
    function listViewModel() {}

    listViewModel.prototype.map = function (array) {
        var list = ko.observableArray([]);
        var viewModel = new ViewModel();
        _.map(array, function (dataItem) {
            list.push(viewModel.map(dataItem));
        });
        return list;
    };

    return listViewModel;
});