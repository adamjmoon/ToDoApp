require.config({
            baseUrl: "/assets/javascripts/",
            paths: {
                'text': 'vendor/requirejs-text/text',
                'dataservice': 'localStorage',
                'plugins': 'durandal/plugins'
            }
});
require(['app'], function () {
        "use strict";

        define('knockout', function(){ return window.ko});
        define('jquery', function(){ return window.$});

        require(['durandal/app', 'durandal/viewLocator', 'durandal/system','localStorage', 'OT'], function (app, viewLocator, system, LocalStorage, OT) {

            OT.DataService = new LocalStorage();
            //>>excludeStart("build", true);
            system.debug(true);
            //>>excludeEnd("build");

            app.title = 'Todo Durandal';

            app.configurePlugins({
                router: true
            });

            app.start().then(function () {
                //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
                //Look for partial views in a 'views' folder in the root.
                viewLocator.useConvention();

                //Show the app by setting the root view model for our application with a transition.
                app.setRoot('viewmodels/shell');
            });
        });

    }
);

