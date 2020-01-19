// All of the middleware goes here
const Campground = require('../models/campground.js');
const Comment = require('../models/comment.js');

const msgs = require('../messages');

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', msgs.mustLogIn);
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                console.log(err);
                // res.render('error', {error: err});
                req.flash('error', err)
                res.redirect('back');
            } else {
                if (!foundCampground){
                    // console.log('This campground does not exist.');
                    // res.render('error', {error: 'This campground does not exist.'});
                    req.flash('error', 'This campground does not exist.');
                    res.redirect('back');
                } else {
                    // does user own the campgounrd?
                    if(req.user.isAdmin || (foundCampground.author.id && foundCampground.author.id.equals(req.user._id))){
                        // allow them to edit
                        return next();
                    } else {
                        // if not, redirect
                        // console.log('You do not have permission to perform this action.');
                        // res.render('error', {error: 'You do not have permission to perform this action.'});
                        req.flash('error', msgs.badPermission);
                        res.redirect('back');
                        // res.send('You must be logged in to perform this action.');
                    }
                }
            }
        })
    } else {
        // console.log('You must be logged in to perform this action.');
        // res.render('error', {error: 'You must be logged in to perform this action.'});
        req.flash('error', msgs.mustLogIn);
        res.redirect('back');
        // res.send('You must be logged in to perform this action.')
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                console.log(err);
                res.render('error', {error: err})
            } else {
                if (!foundComment){
                    console.log('no comment found');
                    // res.render('error', {error: 'This comment does not exist.'});
                    req.flash('error', 'This comment does not exist.');
                    res.redirect('back');
                } else {
                    // console.log(foundComment);
                    if(req.user.isAdmin || (foundComment.author.id && foundComment.author.id.equals(req.user._id))){
                        return next();
                    } else {
                        // console.log('You do not have permission to perform this action.');
                        // res.render('error', {error: 'You do not have permission to perform this action.'});
                        req.flash('error', msgs.badPermission);
                        res.redirect('back');
                    }
                }
            }
        })
    } else {
        // console.log('You must be logged in to perform this action.');
        // res.render('error', {error: 'You must be logged in to perform this action.'});
        req.flash('error', msgs.mustLogIn);
        res.redirect('back');
    }
}

module.exports = middlewareObj;