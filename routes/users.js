const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');

// Load User model
require('../models/User');
const User = mongoose.model('users');

module.exports = router;

// user login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// user logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// user register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
    const body = req.body;
    let errors = [];
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Register form POST
router.post('/register', (req, res) => {
    let errors = [];
    const body = req.body;
    if(body.password !== body.password2){
        errors.push({text: 'Passwords dont match'});
    }
    if(body.password.length < 4){
        errors.push({text: 'Passwords must be atleast 4 characters long'})
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: body.name,
            email: body.email,
            password: body.password,
            password2: body.password2
        });
    }else {
        User.findOne({email: body.email})
            .then( user => {
                if(user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                }else {
                    const user = {
                        name: body.name,
                        email: body.email,
                        password: body.password
                    };
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, function(err, hash) {
                            if (err) throw err;
                            user.password = hash;
                            console.log(user);
                            new User(user)
                                .save()
                                .then( user => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/users/login');
                                })
                                .catch( err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});