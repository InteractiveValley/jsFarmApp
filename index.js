var express = require('express'),
	app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

// abriendo la coneccion a la base de datos
mongoose.connect((process.env.MONGOLAB_URI || 'mongodb://localhost/tvshows'), function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

// Import Models and controllers
var models     = require('./models/tvshow')(app, mongoose);
var TVShowCtrl = require('./controllers/tvshows');


// esta linea sirve para indicar el puerto
app.set('port', (process.env.PORT || 5000));
// esta linea es para cargar los archivos estaticos
app.use(express.static(__dirname + '/public'));

// nuevas lineas para configuracion de express version 4
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// crear el router de la api
var router = express.Router();

// pagina inicial, es posible que esta se modifique para que sea el landing page de la app
app.get('/', function(request, response) {
  response.render('pages/index');
});

// asignamos el router a la aplicacion. 
app.use(router);

// API routes
var tvshows = express.Router();

tvshows.route('/tvshows')
  .get(TVShowCtrl.findAllTVShows)
  .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
  .get(TVShowCtrl.findById)
  .put(TVShowCtrl.updateTVShow)
  .delete(TVShowCtrl.deleteTVShow);

app.use('/api', tvshows);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


