require("dotenv").config({ path: "./config.env" });
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppError = require("./utils/appError");
const Cart = require("./models/cartModel");
const Email = require("./utils/prodEmail");

//Models
const User = require("./models/userModel");

passport.use(
  new GoogleStrategy(
    {
      callbackURL: `https://egy-home.com/auth/google/callback`,
      clientID:
        "515021357384-q9l7lufdnji38k99rr8ugncagcg996sm.apps.googleusercontent.com",
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
            redirect_url = "http://egy-home.com/account/login?google=error";
            return done(null, redirect_url);
          }

          const socialAuthToken = await user.createSocialAuthToken();
          await user.save({ validateBeforeSave: false });

          redirect_url = `http://egy-home.com/shop/catalog?google=${socialAuthToken}`; //registered on FE for auto-login
          return done(null, redirect_url);
        } else {
          const user = new User({
            name: profile.displayName,
            email: user_email,
            registerationType: "google",
          });

          const socialAuthToken = await user.createSocialAuthToken();
          if (!user) {
            return next(new AppError("Error Creating User", 400));
          }

          const cart = await Cart.create({
            cartItems: [],
            user: user._id,
          });

          if (!cart) {
            redirect_url = "http://egy-home.com/account/login?google=error";
            return done(null, redirect_url);
          }

          let emailSent = false;
          try {
            await new Email(user).sendWelcome();
          } catch (err) {
            emailSent = false;
          }

          await user.save({ validateBeforeSave: false });

          // fallback page
          redirect_url = `http://egy-home.com/shop/catalog?google=${socialAuthToken}`; //registered on FE for auto-login
          return done(null, redirect_url);
        }
        // done(null, profile);
      } catch (error) {
        done(error);
      }
    }
  )
);
