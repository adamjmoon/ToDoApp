require(['assets/javascripts/app.js'], function(){
        "use strict";

//        require(['viewmodels/todo','localStorage', 'OT'], function(ViewModel, LocalStorage, ot)
//        {
//            window.OT = ot;
//            window.OT.dataProvider = new LocalStorage();
//            var viewModel = new ViewModel();
//            ko.applyBindings(viewModel);
//            Router({'/:filter': viewModel.showMode}).init();
//            var frame = document.getElementById('frame');
//            frame.style.height = window.innerHeight - 220 +'px';
//        });

        require.config({
            baseUrl: "/assets/javascripts/",
            paths: {
                'text': 'durandal/amd/text'
            }
        });

        require(['durandal/app','durandal/viewLocator','durandal/system','durandal/plugins/router','viewmodels/todo', 'OT'],function(app,viewLocator,system,router,ViewModel,OT) {

            //>>excludeStart("build", true);
            system.debug(true);
            //>>excludeEnd("build");

            app.start().then(function () {
                //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
                //Look for partial views in a 'views' folder in the root.
                viewLocator.useConvention();

                //configure routing
                router.useConvention();
                router.mapNav('/todo:showMode');
                router.mapNav('/work:showMode');
                router.mapNav('/home:showMode');

                //app.adaptToDevice();

                //Show the app by setting the root view model for our application with a transition.
                app.setRoot('viewmodels/todo');
            });
        });

    }
);

