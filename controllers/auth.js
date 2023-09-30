var express = require('express');
var router = express.Router();
require('../passport');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('pages/pages/login');
});

// Auth 
router.get('/', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));


// Auth Callback
router.get('/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    }));

// Success 
router.get('/callback/success', (req, res) => {
    if (!req.user){
        res.redirect('/auth/callback/failure');
    }else{
        res.render('pages/dashboard-influencer', { user: req.user });
    }

});

// failure
router.get('/callback/failure', (req, res) => {
    // res.send("Error user login required");
    res.redirect("/auth/login")
})

router.get("/logout", (req, res) => {
    req.logOut()
    res.redirect("/auth/login")
})

module.exports = router;