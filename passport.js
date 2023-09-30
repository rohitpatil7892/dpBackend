const passport = require('passport');
const Database = require('./database/data-access');
const Errors = require('./errors');
const dotenv = require('dotenv');
dotenv.config();


const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser( (user, done) =>{
  process.nextTick(async function () {
    let condition = `"google_id" = '${user.id}' `;
    let userData = await Database.getObjectByConditions("Users", `"google_id"`, condition, -1, 0);
    if (userData && userData['data'] && userData['data'].length > 0) {
      done(null, user)
    } else {
      done(err, null);
    }
  });
});

process.env.GOOGLE_CALLBACK_URL = `http://localhost:${process.env.PORT}/auth/callback`

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    // return done(null, profile);
    try {
      const email = profile['_json']['email']
      if (!email) return done(new Error('Failed to retrieve email'));

      let condition = `"google_id" = '${profile.id}' `;
      let userData = await Database.getObjectByConditions("Users", `"google_id"`, condition, -1, 0);
      if (userData && userData['data'] && userData['data'].length > 0) {
        return done(null, profile)
      }
      let data = {
        name: profile.displayName,
        google_id: profile.id,
        email_id: profile.email,
        access_token:accessToken
      }
      await Database.createObject("Users", data)
      return done(null, profile)
    } catch (error) {
      done(error)
    }
  }
));