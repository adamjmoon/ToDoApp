define('viewmodels/shell', ['plugins/router', 'durandal/app'], function (router, app) {

    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Todo', moduleId: 'viewmodels/todo', nav: false },
                { route: 'todo(/:showMode)', title: 'Todos', moduleId: 'viewmodels/todo', hash: '#todo',nav: true },
                { route: 'personal(/:subType)(/:showMode)', title: 'Personal', moduleId: 'viewmodels/personal', hash: '#personal',nav: true },
                { route: 'work(/:subType)(/:showMode)', title: 'Work', moduleId: 'viewmodels/work', hash: '#work', nav: true }


            ]).buildNavigationModel();

            return router.activate();
        }
    };
});