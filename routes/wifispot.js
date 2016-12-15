var express = require('express');
var wifispotmodel = require('../models/wifispot');
var nodemailer = require('nodemailer');
var config = require('../config');
var ratingmodel = require('../models/rating');
var jwt = require('jsonwebtoken');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

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
    var newwifi = new wifispotmodel();

    newwifi.wifiName = req.body.wifiName;
    newwifi.hasPassword = req.body.hasPassword;
    newwifi.password = req.body.password;
    newwifi.likes = 0;
    newwifi.dislikes = 0;
    newwifi.dateCreated = req.body.dateCreated;
    newwifi.position = req.body.position;

    newwifi.save(function (err, wifispot) {
        if (err) {
            res.json({mensaje: 'error al introducir la Wifi'})
        } else {
            res.json({
                mensaje: 'Wifi introducida correctamente',
                data: wifispot
            })

        }


    })

});

router.get('/all', function (req, res) {
    wifispotmodel.find(function (err, wifispots) {
        if (err) {
            res.json({mensaje: 'error al devolver todas las wifis'})
        } else {
            res.json({
                mensaje: 'wifis devueltas correctamente',
                data: wifispots
            })
        }
    })
});

router.get('/:wifispot_id', function (req, res) {
    wifispotmodel.findById(req.params.wifispot_id, function (err, wifispot) {
        if (err) {
            res.json({mensaje: 'error al devolver la wifi'})
        } else {
            res.json({
                mensaje: 'wifi devuelta correctamente',
                data: wifispot
            })
        }
    })

});

router.delete('/:wifispot_id', function (req, res) {
    wifispotmodel.remove({_id: req.params.wifispot_id}, function (err, wifispot) {
        if (err) {
            res.json({mensaje: 'no se pudo borrar la wifi'})
        } else {
            res.json({
                mensaje: 'Wifi borrada correctamente'
            })
        }
    })

});

router.post('/like', function (req, res) {
    ratingmodel.findOne({
        wifi_id: req.body.wifi_id,
        user_id: req.body.user_id
    }, function (err, rating) {
        if (err) {
            res.json({mensaje: 'error al guardar rating'});
            return;
        }

        if (rating) {
            res.json({mensaje: 'ya has votado a esta wifi'});
            return;
        }

        var newrating = new ratingmodel();

        newrating.wifi_id = req.body.wifi_id;
        newrating.user_id = req.body.user_id;

        newrating.save(function (err, rating) {
            if (err) {
                res.json({mensaje: 'error al guardar rating'});
                return;
            }

            wifispotmodel.findByIdAndUpdate(req.body.wifi_id, {
                $inc: {
                    likes: 1
                }
            }, function (err) {
                if (err) {
                    res.json({mensaje: 'Error al hacer like'});
                    return;
                }

                res.json({mensaje: 'Like registrado correctamente'})

            })
        });
    });


});

router.post('/dislike', function (req, res) {
    ratingmodel.findOne({
        wifi_id: req.body.wifi_id,
        user_id: req.body.user_id
    }, function (err, rating) {
        if (err) {
            res.json({mensaje: 'error al guardar rating'});
            return;
        }

        if (rating) {
            res.json({mensaje: 'ya has votado a esta wifi'});
            return;
        }

        var newrating = new ratingmodel();

        newrating.wifi_id = req.body.wifi_id;
        newrating.user_id = req.body.user_id;

        newrating.save(function (err, rating) {
            if (err) {
                res.json({mensaje: 'error al guardar rating'});
                return;
            }

            wifispotmodel.findByIdAndUpdate(req.body.wifi_id, {
                $inc: {
                    dislikes: 1
                }
            }, function (err) {
                if (err) {
                    res.json({mensaje: 'Error al hacer dislike'});
                    return;
                }

                res.json({mensaje: 'Dislike registrado correctamente'})

            })
        });
    });


});



module.exports = router;