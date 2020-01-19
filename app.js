require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port;
const mongoose = require('mongoose');
const flash = require('connect-flash');
const Campground = require('./models/campground.js');
const Comment = require('./models/comment.js');
const seedDB = require('./seeds.js');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const methodOverride = require('method-override');



const campgroundRoutes = require('./routes/campgrounds.js');
const commentRoutes = require('./routes/comments.js');
const indexRoutes = require('./routes/index.js');

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: 'Lilly and Honey are the cutest pups',
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
// middleware in order to pass 'currentUser' to each page
// this is called on every route!
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.messageSuccess = req.flash('success')
    res.locals.messageError = req.flash('error')
    res.locals.moment = require('moment');
    // console.log(`req.user: ${req.user}`)
    // console.log(`current user from middleware: ${res.locals.currentUser}`)
    next();
})
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// replace this with your mongo atlas cluster string if hosting
let uri = 'mongodb://localhost:27017/yelpcamp'
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}
mongoose.connect(uri, options).then(
    ()=>{
        console.log(`Successfully connected to mongodb database at ${new Date}.`)
    },
    err=>{
        console.log(err);
    }
)

// seedDB();
Campground.find({}, (err,allCampgrounds)=>{
    // console.log(allCampgrounds.length)
    if(err){console.log(err)}else{
        if(allCampgrounds.length === 0){
            seedDB()
        }
    }
})
// seedDB()
// need comments first

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get('*', (req, res)=>{
    // console.log('hello')
    // res.render('landing')
    res.redirect('/')
})

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

