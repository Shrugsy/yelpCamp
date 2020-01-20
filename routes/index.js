const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const msgs = require('../messages');
const middleware = require('../middleware');
const Campground = require('../models/campground');

// =========================
//HOME
router.get('/', (req, res)=>{
    res.render('landing');
});

// ========================
// AUTH ROUTES

// show register form
router.get('/register', (req, res)=>{
    res.render('register');
})

// handle register logic
router.post('/register', (req, res)=>{
    // let newUser = new User({username: req.body.username})
    let newUser = new User(req.body.user)
    newUser.username = req.body.username
    if (req.body.avatar !== ''){
        newUser.avatar = req.body.avatar;
    }
    console.log(req.body.user);
    // eval(require('locus'))
    if (req.body.adminCode === process.env.correctAdminCode){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register')
            // return res.render('register', {messageError: err.message});
        }
        passport.authenticate('local')(req, res, ()=>{
            console.log(`New user registered at ${Date.now}`)
            // console.log('new user')
            console.log(user)
            req.flash('success', msgs.newUserSuccess(user.username))
            res.redirect('/campgrounds')
        })
    })
})



// login form
router.get('/login', (req, res)=>{
    res.render('login', {referer: req.headers.referer})
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
            if (req.body.referer && (req.body.referer.slice(-6) !== 'login')){
                return res.redirect(req.body.referer)
            } else {
                return res.redirect('/campgrounds');
            }
            
        });
    })(req, res, next);
});

// log out
router.get('/logout', middleware.isLoggedInLoggingOut, (req, res)=>{
    req.logout();
    console.log('user logged out')
    req.flash('success', msgs.signOutSuccess);
    // res.redirect('back')
    res.redirect('/campgrounds')
});

// USER PROFILE
router.get('/users/:userId', (req, res)=>{
    User.findById(req.params.userId, (err, foundUser)=>{
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back')
        } else {
            Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds)=>{
                if(err){
                    console.log(err);
                    req.flash('error', err.message);
                    res.redirect('back')
                } else {
                    res.render('users/show', {user: foundUser, campgrounds: campgrounds});
                }
            })
        }
    })
});

// USER PROFILE EDIT
router.get('/users/:userId/edit', middleware.checkProfileOwnership, (req, res)=>{
    // console.log('trying')
    User.findById(req.params.userId, (err, foundUser)=>{
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.render('users/edit', {user: foundUser})
        }
    })
    
    // res.send('trying to edit user id' + req.params.userId)
})

// USER PROFILE UPDATE
router.put('/users/:userId', middleware.checkProfileOwnership, (req, res)=>{
    User.findById(req.params.userId, (err, usr)=>{
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            let origUsername = usr.username
            let user = req.body.user
            user.username = req.body.username
            if (req.body.avatar !== ''){
                user.avatar = req.body.avatar;
            }
            User.findByIdAndUpdate(req.params.userId, user, {new: true}, (err, updatedUser)=>{
                if(err){
                    req.flash('error', err.message);
                    res.redirect('back');
                } else {
                    if (req.body.newPassword0 !== ''){
                        if (req.body.newPassword0 === req.body.newPassword1){
                            updatedUser.setPassword(req.body.newPassword0, (err)=>{
                                if(err){
                                    console.log(err)
                                    req.flash('error', err.message);
                                    res.redirect('back');
                                }else{
                                    updatedUser.save();
                                }
                            })
                        } else {
                            req.flash('warning', msgs.passwordsDoNotMatch);
                        }
                    }
                    let msg = msgs.editProfileSuccess;
                    // if username changes, need to tell user to log back in
                    if (origUsername !== updatedUser.username){
                        msg+= ' ' + msgs.pleaseLogIn
                    }
                    req.flash('success', msg)
                    res.redirect('/users/'+updatedUser._id);
                }
            })
        }
    })       


})

module.exports = router;