var express = require('express');
var ratingmodel = require('../models/rating');
var config = require('../config');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3030');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method != 'GET') {
        var token = req.headers['authorization'];
        if (!token) {
            res.json({mensaje: 'tienes que estar logueado'});
            return
        }

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.json({mensaje: 'token incorrecto'});
                return
            }
            next()
        });
    } else {
        next()
    }
});

router.post('/', function (req, res) {
    var newrating = new ratingmodel();

    newrating.likes = false;
    newrating.wifi_id = req.body.wifi_id;
    newrating.user_id = req.body.user_id;

    newrating.save(function (err, rating) {
        if (err) {
            res.json({mensaje: 'error al hacer like'})
        } else {
            res.json({
                mensaje: 'Like hecho correctamente en la wifi',
                data: rating
            })
        }
    })
});

router.get('/all', function (req, res) {
    ratingmodel.find(function (err, rating) {
        if (err) {
            res.json({mensaje: 'error al devolver todos los likes'})
        } else {
            res.json({
                mensaje: 'Likes devueltos correctamente',
                data: rating
            })
        }
    })
});


module.exports = router;
