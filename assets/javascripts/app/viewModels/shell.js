define('viewmodels/shell', ['plugins/router', 'durandal/app'], function (router, app) {

    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Todo', moduleId: 'viewmodels/todo', nav: false },
                { route: 'todo(/:showMode)', title: 'Todo', moduleId: 'viewmodels/todo', hash: '#todo',nav: true },
                { route: 'work(/:showMode)', title: 'Work Todo', moduleId: 'viewmodels/work', hash: '#work', nav: true },
                { route: 'chores(/:showMode)', title: 'Chores Todo', moduleId: 'viewmodels/chores', hash: '#chores', nav: true },
                { route: 'grocery(/:showMode)', title: 'Grocery List', moduleId: 'viewmodels/grocery', hash: '#grocery', nav: true },


            ]).buildNavigationModel();

            return router.activate();
        }
    };
});