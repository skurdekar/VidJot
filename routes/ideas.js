const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

module.exports = router;

// ideas index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })
});

// Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if(idea.user === req.user.id){
                res.render('ideas/edit', {
                    idea: idea
                });
            } else  {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            }
        })
});

// add idea
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'title is required'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'details are required'
        });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const idea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(idea)
            .save()
            .then(idea => {
                req.flash('success_msg', "Video Idea added");
                res.redirect('/ideas')
            });
    }
});

// Update idea form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', "Video Idea updated");
                    res.redirect('/ideas');
                })
        })
});

// delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    req.flash('success_msg', 'Video Idea removed');
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/ideas');
        });
});
