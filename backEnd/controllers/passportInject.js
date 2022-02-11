const passport = require("passport");
//GOOGLE AUTHENTICATION
var GoogleStrategy = require("passport-google-oauth2").Strategy;

// exports.initPassport = (app) => {
// app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      // return cb(err, profile);
      process.nextTick(async function () {
        try {
          // 1)
          // Check if the google profile has an email associated. Sometimes google profiles can be created by phone
          // numbers in which case google doesn't have an email - if email is not present,
          // we fail the signup with the proper error message
          if (!profile.email) {
            return done(null, false, {
              message:
                "Google Account is not registered with email. Please sign in using other methods",
            });
          }

          // 2)check if user is found
          // found => login user
          // not fount =>createNew user then login it
          const user = await User.findOne({ email: profile.email });
          if (user) {
            console.log(user);
            return done(null, user);
          }

          console.log(user, error);
          // await user.create({})
          return done(null, false, { message: "Not found" });
        } catch (err) {
          console.log("HI");
          return done(null, false, { message: "error kebeer" });
        }
      });
    }
  )
);
// };
