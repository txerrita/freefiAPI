// llamada a los paquetes que necesitamos
var express    = require('express');            // llamada a express
var app        = express();                     // define our app using express
var bodyParser = require('body-parser');        // llamada a body-parser para dar formato a json
var mongoose   = require('mongoose');           // llamada a la mogoose para acceso a MongoDB
var config     = require('./config.js');        // archivo de configuración general

//routes
var userroutes = require('./routes/user');  
var wifiroutes = require('./routes/wifispot');
var ratingroutes = require('./routes/rating');


// configuración de la aplicación para que use BodyParser()
// esto nos permite recoger los datos de un POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// conexión con la BD en MongoLab
mongoose.connect(config.databaseurl); //config.databaseurl es la dirección configurada en el archivo config.js que accede a la BD en MongoLab
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log('Conectado a la base de datos "WifiSpot" en MongoLab')
});

var port = process.env.PORT || 3030;        // seleccionamos el puerto para las url



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
app.use('/users', userroutes);
app.use('/wifi', wifiroutes);
app.use('/rating', ratingroutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Algo mágico sucede en el puerto ' + port);

