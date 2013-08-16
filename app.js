var express = require('express')
    , http = require('http')
    , fs = require('fs')
    , path = require('path');


var app = module.exports = express();

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.use(express.errorHandler());
app.configure('production', function () {
});

app.configure(function () {
    app.locals.basedir = __dirname + '/assets';
    app.set('port', 5000);
    app.set('views', __dirname);
    app.set('view engine', 'jade');


    app.use(express.logger('dev'));
    app.use(express.bodyParser({
        keepExtensions:false
    }));
    app.use(app.router);
    app.use(express.static(__dirname));
    // make a custom html template
});


app.configure('development', function () {
    app.use(express.errorHandler());
});

// Routes

app.get('/', function (req, res) {
    res.render('index');
})

// Start the app
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});