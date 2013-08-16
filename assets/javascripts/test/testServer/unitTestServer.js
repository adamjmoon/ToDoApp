var express = require('express')
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , growl = require('growl');


var app = module.exports = express();

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.use(express.errorHandler());
app.configure('production', function () {
});

app.configure(function () {
    app.locals.basedir = __dirname;
    app.set('port', 4000);
    app.set('views', app.locals.basedir + '/views/');
    app.set('view engine', 'jade');
    app.use(express.favicon());

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

app.get('/runner', function (req, res) {
    res.render('runner');
    next();
})

app.get('/specs', function (req, res) {
    var path = __dirname + '/js/specs/';
    var requireSpecList = [];
    fs.readdir(path, function (err, files) {
        var spec = '';
        for (var i = 0, j = files.length; i < j; i++) {
            spec = '/js/specs/'+files[i];
            requireSpecList.push(spec);
        }
        console.log(requireSpecList);
        res.send(requireSpecList);
    });
})

app.get('/benchmarkList', function (req, res) {
    var path = __dirname + '/js/benchmarks/';
    var requireSpecList = [];
    fs.readdir(path, function (err, files) {
        var benchmark = '';
        for (var i = 0, j = files.length; i < j; i++) {
            benchmark = '/js/benchmarks/'+files[i];
            requireSpecList.push(benchmark);
        }
        console.log(requireSpecList);
        res.send(requireSpecList);
    });
})

app.get('/benchmarks', function (req, res) {
    res.render('benchmarks');
})

app.all('/results', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/coverage', function (req, res) {

    fs.writeFile(__dirname + '/coverage/coverage.json',req.body.coverage, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("coverage.json file was saved!");
            res.send(200);
        }
    });
})

app.post('/stats', function (req, res) {

    if (typeof(growl) != "undefined") {
        var stats = req.body.stats;
        if (stats.failures > 0) {
            growl(stats.failures + ' of ' + stats.tests + ' tests failed', {
                title:"JS Unit Test Failure",
                image:__dirname + "/content/error.png"
            });
        }
        else {
            growl(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
                title:"JS Unit Test Success",
                image:__dirname + "/content/ok.png"
            });
        }
    }
    res.send(200);
})

app.post('/log/error', function (req, res) {
    console.log(req.body[0]);
    res.send(500);
})


app.post('/log/warning', function (req, res) {
    console.log(req.body);
    res.send(500);
})


app.get('/customerservice', function (req, res) {
    res.send(500);
})


// Start the app
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});