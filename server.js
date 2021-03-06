var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');

var app = express();

var userCtrl = require('./controllers/userCtrl.js');
var travelCtrl = require('./controllers/travelCtrl.js');
var petsCtrl = require('./controllers/petsCtrl.js');

// Middlware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/views'));



app.get('/users', userCtrl.read);
app.post('/users/', userCtrl.create);
app.put('/users/:id', userCtrl.update);
app.delete('/users/:id', userCtrl.delete);

app.get('/travel', travelCtrl.read);
app.post('/travel/', travelCtrl.create);
app.put('/travel/:id', travelCtrl.update);
app.delete('/travel/:id', travelCtrl.delete);

app.get('/pets', petCtrl.read);
app.post('/pets/', petCtrl.create);
app.put('/pets/:id', petCtrl.update);
app.delete('/pets/:id', petCtrl.delete);


if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');

  app.use('/static', express.static('static'));
} else {
  // When not in production, enable hot reloading

  var chokidar = require('chokidar');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));

  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  var watcher = chokidar.watch('./server');
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/\/server\//.test(id)) delete require.cache[id];
      });
    });
  });
}


mongoose.connect("mongodb://localhost:27017/blog-db");
mongoose.connection.once('open', function(){
  console.log("MongoDB connected successfully");
});

// Render the index (referring to root of views specified above (__dirname + '/views'))
app.get('/', function(req, res){
  res.render('index');
});

// app.on('stormpath.ready', function () {
  app.listen(8080, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Listening on 8080');
  });
// });
