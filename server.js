const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const session = require('express-session')
const redis = require('redis');
require('./passport');
const dotenv = require('dotenv');
dotenv.config();
const app = express();


const authRouters = require('./controllers/auth');




app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRouters);

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.on('connect', function () {
    console.log('Redis cache connected!');
});

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}

app.get('*', function (req, res) {
    res.sendFile(__dirname+'/views/pages/pages/404-page.html');
})


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});