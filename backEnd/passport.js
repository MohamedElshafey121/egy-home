require("dotenv").config({ path: "./config.env" });
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppError = require("./utils/appError");

//Models
const User = require("./models/userModel");

passport.use(
  new GoogleStrategy(
    {
      callbackURL: `/auth/google/callback`, //same URI as registered in Google console portal
      clientID:
        "86361996733-cec3aijk2t1tf9svbi27rm3kfvd465d4.apps.googleusercontent.com", //replace with copied value from Google console
      clientSecret: "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",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user_email = profile.emails && profile.emails[0].value; //profile object has the user info

        //check whether user exist in database
        const user = await User.findOne({ email: user_email });

        let redirect_url = "";
        //generating social auth random token token
        if (user) {
          //check registeration method
          if (user.registerationType !== "google") {
            redirect_url = "http://localhost:3000/account/login?google=error";
            return done(null, redirect_url);
          }

          const socialAuthToken = await user.createSocialAuthToken();
          await user.save({ validateBeforeSave: false });

          redirect_url = `http://localhost:3000/shop/catalog?google=${socialAuthToken}`; //registered on FE for auto-login
          return done(null, redirect_url);
        } else {
          const user = new User({
            name: profile.displayName,
            email: user_email,
            registerationType: "google",
          });

          const socialAuthToken = await user.createSocialAuthToken();
          await user.save({ validateBeforeSave: false });

          // fallback page
          redirect_url = `http://localhost:3000/shop/catalog?google=${socialAuthToken}`; //registered on FE for auto-login
          return done(null, redirect_url);
        }
        // done(null, profile);
      } catch (error) {
        done(error);
      }
    }
  )
);
