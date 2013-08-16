(function () {
    "use strict";
    var loadApp = document.createElement('script');
    loadApp.type = 'text/javascript';
    loadApp.src = '/assets/javascripts/app.min.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(loadApp, s);
})();
