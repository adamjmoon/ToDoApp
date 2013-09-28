module.exports = (grunt) ->
  contentRoot = __dirname + '/assets/'
  js = contentRoot + 'javascripts/'
  styles = contentRoot + 'styles/'
  vendor = js + 'vendor/'
  app = js + 'app/'
  ot = js + 'ot/'
  views = js + 'app/views/'
  test = js + 'test/'
  specs = test + 'specs/'
  benchmarks = test + 'benchmarks/'
  testServer = test + 'testServer/'
  testServerJs = testServer + 'js/'
  coverage = testServer + 'coverage/'
  css = contentRoot + 'css/'
  cp = require('child_process')
  appServerPath = __dirname + '/app.js'
  appUrl = 'localhost:5000'
  appServerPort = 5000
  appServerWebSocketPort = 5001
  testServerPath = testServer + 'unitTestServer.js'
  testServerUrl = 'localhost:4000'
  testServerPort = 4000
  testServerWebSocketPort = 4001

  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-yui-compressor'
  grunt.loadNpmTasks 'grunt-istanbul'
  grunt.loadNpmTasks 'grunt-parallel'
  grunt.loadNpmTasks 'grunt-contrib-requirejs'
  grunt.loadNpmTasks 'grunt-contrib-less'

  # Make task shortcuts
  grunt.registerTask 'default', ['parallel:dev', 'instrument']
  grunt.registerTask 'build', ['concat:vendor', 'concat:css', 'min']

  # Configure Grunt
  grunt.initConfig
    jshint:
      files: [app + '**/*.js']
    concat:
      vendor:
        src: [vendor + '*.js', js + 'livereload.js', js + 'main.js']
        dest: js + 'vendor.js'
      testVendors:
        src: [testServerJs + 'vendor/*.js']
        dest: testServerJs + 'vendorUnitTestScripts.js'
      ot:
        src: [ot + '*.js']
        dest: app + 'ot.js'
      app:
        src: [app + '**/*.js']
        dest: js + 'app.js'
      appmin:
        src: [app + '**/*.js']
        dest: js + 'app.min.js'
    requirejs:
      compile:
        options:
          baseUrl: js
          name: 'main'
          out: js + 'dist/app.min.js'
    min:
      'vendor':
        'src': 'assets/javascripts/vendor.js'
        'dest': 'assets/javascripts/vendor.min.js'
      'testVendors':
        'src': 'assets/javascripts/test/testServer/js/vendorUnitTestScripts.js'
        'dest': 'assets/javascripts/test/testServer/js/vendorUnitTestScripts.min.js'
      'app':
        'src': 'assets/javascripts/app.js'
        'dest': 'assets/javascripts/app.min.js'
    less:
      dev:
        options:
          paths: ['assets/styles']
        files: [
          'assets/styles/app.css': 'assets/styles/app.less'
        ]
      prod:
        options:
          paths: [styles]
          yuicompress: true
        files:
          'assets/styles/app.css': 'assets/styles/app.less'
    jade:
      compile:
        options:
          data:
            debug: true
          pretty: true
          basedir: ''
        files: [
          src: 'assets/javascripts/views/*.jade'
          ext: ".html"
          expand: true
        ]
    parallel:
      dev:
        options:
          stream: true
          grunt: true
        tasks: ['concat',
                'compileSpecs',
                'jade',
                'less:dev',
                'startAppServer',
                'openApp',
                'startUnitTestServer',
                'openUnitTestReport',
                'watch']
    watch:
      scripts:
        files: [js + 'main.js', app + '**/*.js', ot + '*.js', css + 'app/*.css']
        tasks: ['concat', 'liveReload_App']
        options:
          nospawn: true
          interrupt: true
      test:
        files: [test + '/**/*.coffee']
        tasks: ['compileSpecs', 'openUnitTestReport']
        options:
          nospawn: true
          interrupt: true
      jade:
        files: [contentRoot + '/javascripts/views/**/*.jade', contentRoot + 'index.jade']
        tasks: ['jade', 'liveReload_App']
        options:
          nospawn: true
          interrupt: true
      less:
        files: [styles + '**/*.less']
        tasks: ['less:dev', 'liveReload_App']
        options:
          nospawn: true
          interrupt: true
      testServerLiveReload:
        files: [testServer + 'views/*.jade', testServer + 'views/shared/*.jade', testServer + 'views/*.html',
                testServer + 'views/shared/*.html', testServer + 'js/specs/*.js', testServer + 'js/benchmarks/*.js' ]
        tasks: ['liveReload_UnitTestReport']
        options:
          nospawn: true
          interrupt: true
    makeReport:
      src: coverage + 'coverage.json'
      options:
        type: 'html'
        dir: coverage
    instrument:
      files: js + 'app.js'
      options:
        basePath: coverage
        flatten: true

  grunt.registerTask 'startAppServer', ->
    alreadyOn = false
    callback = (result) ->
      alreadyOn = result
      unless alreadyOn
        startServer(done, appServerPath)
      else
        console.log 'no need to start JS Unit Test Server'
        done()
    testSocket appServerPort, this.async, callback
    done = this.async()

  grunt.registerTask 'startUnitTestServer', ->
    alreadyOn = false
    callback = (result) ->
      alreadyOn = result
      unless alreadyOn
        startServer(done, testServerPath)
      else
        console.log 'no need to start JS Unit Test Server'
        done()
    testSocket testServerPort, this.async, callback
    done = this.async()

  grunt.registerTask 'kill', ->
    exec = cp.exec
    nodekill = exec('taskkill /IM node.exe /F', {}, () ->
      done())
    nodekill.stdout.pipe process.stdout
    nodekill.stderr.pipe process.stderr
    grunt.log.write 'Waiting...'
    done = this.async()

  grunt.registerTask 'compileSpecs', ->
    exec = cp.exec
    script = specs + 'coffee.cmd'
    coffeeSpecs = exec(script, null, () ->
      done())
    coffeeSpecs.stdout.pipe process.stdout
    coffeeSpecs.stderr.pipe process.stderr
    done = this.async()
    script = benchmarks + 'coffee.cmd'
    coffeeBenchmarks = exec(script, null, () ->
      done())
    coffeeBenchmarks.stdout.pipe process.stdout
    coffeeBenchmarks.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'runTests', ->
    exec = cp.exec
    phantomRunner = __dirname + '//phantomRunner.cmd'
    console.log phantomRunner
    phantomTestRunner = exec(phantomRunner, null, () ->
      done())
    phantomTestRunner.stdout.pipe process.stdout
    phantomTestRunner.stderr.pipe process.stderr
    done = this.async()

  grunt.registerTask 'openApp', ->
    pageAlreadyOpen = false
    callback = (result) ->
      pageAlreadyOpen = result
      console.log pageAlreadyOpen
      unless pageAlreadyOpen
        openPage(done, appUrl)
      else
        console.log('App Already Open')
    testWebSocket appServerWebSocketPort, this.async, callback
    done = this.async()

  grunt.registerTask 'openUnitTestReport', ->
    pageAlreadyOpen = false
    callback = (result) ->
      pageAlreadyOpen = result
      unless pageAlreadyOpen
        openPage done, testServerUrl
      else
        console.log('Unit Test Report Already Open')
    testWebSocket testServerWebSocketPort, this.async, callback
    done = this.async()

  grunt.registerTask 'liveReload_UnitTestReport', ->
    callback = (result) ->
      console.log(result)
    testWebSocket testServerWebSocketPort, this.async, callback

  grunt.registerTask 'liveReload_App', ->
    callback = (result) ->
      console.log(result)
    testWebSocket appServerWebSocketPort, this.async, callback

  startServer = (done, serverPath) ->
    spawn = cp.spawn
    server = spawn('node', [serverPath])
    server.stdout.pipe process.stdout
    server.stderr.pipe process.stderr
    server.on 'exit', (code) ->
      console.log 'server killed'
      done()

  openPage = (doneCallback, url) ->
    console.log(url)
    spawn = require('child_process').spawn
    chrome = spawn process.env[(if (process.platform is 'win32') then 'USERPROFILE' else 'HOME')] +
    '//AppData//Local//Google//Chrome//Application//chrome.exe',
      ['--new-tab --enable-benchmarks', url]
    doneCallback()

  testSocket = (port, async, result) ->
    net = require('net')
    sock = new net.Socket()
    sock.setTimeout 1500
    sock.on('connect',
    () ->
      result true
      done()
    ).on('error',
    (e) ->
      sock.destroy()
      result(false)
      done()
    ).on('timeout',
    (e) ->
      console.log 'ping timeout'
      result(false)
      done()
    ).connect port, '127.0.0.1'
    grunt.log.write 'Waiting...'
    done = async

  testWebSocket = (port, async, result) ->
    WS = require('ws').Server
    wss = new WS({ port: port, verifyClient: true })

    wss.on 'connection', (ws) ->
      ws.send JSON.stringify(r: Date.now().toString()), (error) ->
        unless error
          result true
          wss.close()
          done()
        else
          console.log e
          result false
          wss.close()
          done()

    checkTimeout = () -> if wss._server && wss._server.connections == 0
      result false
      wss.close()
      done()
    setTimeout checkTimeout, 500
    grunt.log.write 'Waiting...'
    done = async