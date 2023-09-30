const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const session = require('express-session')
const redis = require('redis');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.on('connect', function () {
    console.log('Redis cache connected!');
});

require('./passport');
const app = express();
const dotenv = require('dotenv');

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}

dotenv.config();

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());


// app.set('view engine', 'ejs');

app.get('/login',(req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>")
});

// Auth 
app.get('/auth', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));


// Auth Callback
app.get('/auth/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    }));

// Success 
app.get('/auth/callback/success', (req, res) => {
    if (!req.user)
        res.redirect('/auth/callback/failure');
    res.send("Welcome " + req.user.email + "/n"+ "<button><a href='/logout'>Log Out</a></button>");
});

// failure
app.get('/auth/callback/failure', (req, res) => {
    // res.send("Error user login required");
    res.redirect("/login")
})

app.get("/logout", (req,res) => {
    req.logOut()
    res.redirect("/login")
    console.log(`-------> User Logged out`)
})
// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});