ToDoApp with Durandal
=====================

[1]:  http://durnandaljs.com/                "Durandal"
[2]:  http://knockoutjs.com/                 "Knockout"
[3]:  http://requirejs.org                   "RequireJS / almond.js"
[4]:  http://lodash.com                      "Lo-Dash"
[5]:  http://jquery.com/                     "jquery"
[6]:  http://amplifyjs.com                   "amplifyjs"
[7]:  http://getbootstrap.com                "bootstrap"
[8]:  http://lesscss.org/                    "less"
[9]:  http://jade-lang.com/                  "jade"
[10]: http://visionmedia.github.io/mocha/    "mocha"
[11]: http://sinonjs.org/                    "sinon"
[12]: http://coffeescript.org/               "coffescript"
[12]: http://benchmarkjs.com/                "benchmarksjs"
[13]: https://github.com/gotwarlost/istanbul "istanbul"
[14]: http://gruntjs.com/                    "grunt"
[15]: http://requirejs.org/docs/optimization.html                    "r.js"

Frameworks used:

| `javascript`    | `styles`        | `templates`| `unit tests` `benchmarks` `coverage` | `build` `optimize` |
| -------------   |:---------------:|:----------:|:------------------------------------:|:------------------:|
| [`Durandal`][1] |[`bootstrap`][7] |[`jade`][9] | [`mocha`][10]                        | [`grunt`][14]      |
| [`Knockout`][2] |[`less`][8]      |            | [`sinon`][11]                        | [`r.js`][15]       |
| [`RequireJS`][3]|                 |            | [`benchmarkjs`][12]              
| [`Lo-Dash`][4]  |                 |            | [`istanbul`][13]
| [`Jquery`][5]   |
| [`AmplifyJS`][6]|

Setup
=====
Windows
   1. Install [`node.js`](http://nodejs.org/)
   2. Install [`growl`](http://www.growlforwindows.com/gfw/) *Note: THIS IS OPTIONAL
   3. Run `npm_install.bat`
       * installs app node dependencies
       * installs unit test server node dependencies in test server directory
   4. Run `grunt`
       Completes the following steps in parallel
       * combine js and css files
       * compile coffeescript unit tests,
       * compile jade templates to html,
       * start Node Express App Server,
       * open browser tab to App url localhost:5000,
       * start Node Express Unit/Integeration/Benchmark/Code Coverage Server,
       * open browser tab to Unit Test Server url localhost:4000
       * setup watcher with Live Reload

