const express = require('express');
const router = express.Router();

const Campground = require('../models/campground.js')
const middleware = require('../middleware');

//INDEX
router.get('/', (req, res)=>{
    // get all campgrounds from database
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

//NEW
router.get('/new', middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
})

//CREATE
router.post('/', middleware.isLoggedIn, (req, res)=>{
    // REST convention?
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page (the GET /campgrounds route)
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    if (name !== "" && image !== "") {
        Campground.create(
            {
                name: name,
                image: image,
                description: description,
                author: author,
                createdAt: new Date
            }, (err, campground)=>{
                if(err){
                    console.log(err);
                } else {
                    console.log("New campground saved to DB: ");
                    console.log(campground);
                    res.redirect("/campgrounds");
                }
            }
        )
    } else {
        console.log('All fields are required for this function.')
    }
})

//SHOW
//NOTE order of routes. This must be after /campgrounds/new
router.get('/:id', (req, res)=>{
    // find the campground with the provided id
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err)
            res.render('error', {error: err})
        } else {
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
    // get the corresponding entry for that id
    // render the 'show' template with that campground
})

// EDIT
// /:id/edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
    // if user logged in
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.log(err);
            res.render('error', {error: err})
        } else {
            res.render('campgrounds/edit', {campground: foundCampground})
        }
    })

        
    // if not, redirect


})

// UPDATE
// /:id
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
    // find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            console.log(err);
            res.render('error', {error: err});
        } else {
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
    // redirect to show page for that id
    // res.send('updating campground')
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            console.log(err);
            res.render('error', {error: err});
        } else {
            res.redirect('/campgrounds')
        }

    })
    // res.send('trying to delete ' + req.params.id)
})

module.exports = router;

