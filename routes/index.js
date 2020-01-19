const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const msgs = require('../messages');
const middleware = require('../middleware');

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
    // eval(require('locus'))
    if (req.body.adminCode === process.env.correctAdminCode){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register')
            // return res.render('register', {messageError: err.message});
        }
        passport.authenticate('local')(req, res, ()=>{
            req.flash('success', msgs.newUserSuccess(user.username))
            res.redirect('/campgrounds')
        })
    })
})

// login form
router.get('/login', (req, res)=>{
    res.render('login')
})
// handle login logic
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/campgrounds',
//     failureRedirect: '/login',
//     // successFlash: msgs.logInSuccess(currentUser.username),
//     failureFlash: true
//     }) ,(req, res)=>{
//         console.log(req)
//         console.log(res);
// })

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{
        if (err) {
            req.flash('error', err.message)
            return next(err); 
        }
        if (!user) {
            req.flash('error', info.message)
            return res.redirect('/login'); 
        }
        req.logIn(user, (err)=>{
            if(err) {
                req.flash('error', err.message)
                return next(err); 
            }
            req.flash('success', msgs.logInSuccess(req.user.username))
            return res.redirect('/campgrounds');
        });
    })(req, res, next);
});

// log out
router.get('/logout', middleware.isLoggedIn, (req, res)=>{
    
    req.logout();
    console.log('user logged out')
    req.flash('success', msgs.signOutSuccess);
    // res.redirect('back')
    res.redirect('/campgrounds')
})

module.exports = router;