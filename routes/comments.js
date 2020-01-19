const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/');

// =========================
// COMMENTS ROUTES
// =========================

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){console.log}else{
            res.render('comments/new', {campground: campground})
        }
    })
})

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res) =>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){console.log(err)}else{
            Comment.create(req.body.comment, (err,comment)=>{
                if(err){console.log(err)}else{
                    // add username and id to comment
                    console.log(req.user)
                    comment.author = {
                        id: req.user._id,
                        username: req.user.username
                    }
                    comment.save()
                    campground.comments.push(comment);
                    campground.save((err,data)=>{
                        if(err){console.log(err)}else{
                            console.log(data)
                            res.redirect('/campgrounds/'+req.params.id)
                        }
                    })
                }
            })
        }
    })
})

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.render('error', {error: err})
        } else {
            Comment.findById(req.params.comment_id, (err, comment)=>{
                if(err){
                    console.log(err);
                    res.render('error', {error: err})
                } else {
                    res.render('comments/edit', {campground_id: campground, comment: comment})
                }
            })
        }
    })
})

// UPDATE ROUTE
router.put('/:comment_id/', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        if(err){
            console.log(err);
            res.render('error', {error: err})
        } else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})

// DESTROY ROUTE
router.delete('/:comment_id/', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.render('error', {error: err})
        } else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})

module.exports = router;