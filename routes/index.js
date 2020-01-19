const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// =========================
//HOME
router.get('/', (req, res)=>{
    res.render('landing');
});

// ========================
// AUTH ROUTES

// show register form
router.get('/register', (req, res)=>{
    res.render('register')
})

// handle register logic
router.post('/register', (req, res)=>{
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/campgrounds')
        })
    })
    // res.send('signing you up');
})

// login form
router.get('/login', (req, res)=>{
    res.render('login')
})
// handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }) ,(req, res)=>{
        console.log(res)
})

// log out
router.get('/logout', (req, res)=>{
    req.logout();
    console.log('user logged out')
    res.redirect('back')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = router;