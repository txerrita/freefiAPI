var express = require('express');
var usermodel = require('../models/user');
var nodemailer = require('nodemailer');
var config = require('../config');
var passwordHash = require('password-hash');
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

    if (req.url == '/all') {
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


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.post('/', function (req, res) {
    usermodel.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.json({mensaje: 'Error al guardar el usuario'})
        } else if (user && user.email != 'joserra.o@gmail.com') {
            res.json({mensaje: 'El email ya existe'})
        } else {
            var newuser = new usermodel(); //hemos creado un schema nuevo del usuario

            newuser.emailverified = false;
            newuser.email = req.body.email;
            newuser.password = passwordHash.generate(req.body.password);

            newuser.save(function (err, user) {
                if (err) {
                    res.json({mensaje: 'error al introducir usuario'})
                } else {
                    var transporter = nodemailer.createTransport(config.emailconfig);
                    var mailOptions = {
                        from: '"Fred Foo 👥" <joserra@gmail.com>', // sender address
                        to: newuser.email, // list of receivers
                        subject: 'Bienvenido a Freefi ✔', // Subject line
                        html: '<b>Verifica tu correo. Haz click en la siguiente dirección para verificar tu email.</b>' +
                        '<a href = "http://localhost:3030/users/verify/' + user._id + '"> Verifica tu Email</a>'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        res.json({
                            mensaje: 'usuario introducido correctamente',
                            data: user
                        })
                    });
                }
            })
        }
    })
});

router.get('/all', function (req, res) {
    usermodel.find(function (err, users) {
        if (err) {
            res.json({mensaje: 'error al devolver todos los usuarios'})
        } else {
            res.json({
                mensaje: 'usuarios devueltos correctamente',
                data: users
            })
        }
    })
});

router.get('/verify/:user_id', function (req, res) {
    usermodel.findByIdAndUpdate(req.params.user_id, {
        $set: {
            emailverified: true
        }
    }, function (err) {
        if (err) {
            res.json({mensaje: 'Error al verificar usuario'})
        } else {
            res.json({mensaje: 'Usuario verificado correctamente'})
        }
    })
});

router.post('/changepassword/:user_id', function (req, res) {
    usermodel.findByIdAndUpdate(req.params.user_id, {
        $set: {
            password: passwordHash.generate(req.body.password)
        }
    }, function (err) {
        if (err) {
            res.json({mensaje: 'Error al cambiar el password'})
        } else {
            res.json({mensaje: 'Password cambiado correctamente'})
        }
    })
});

router.post('/login', function (req, res) {
    //primero si existe el usuario
    usermodel.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.json({mensaje: 'error al verificar usuario'});
            return;

        }

        if (!user) {
            res.json({mensaje: 'el usuario no existe'});
            return;
        }

        if (!passwordHash.verify(req.body.password, user.password)) {
            res.json({mensaje: 'el password es incorrecto'});
            return;
        }

        var token = jwt.sign(user, config.secret);

        res.json({
            mensaje: 'usuario logueado correctamente',
            token: token
        })

    });

});

module.exports = router;

