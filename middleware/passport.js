const localStorage = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const passport = require("passport");

module.exports = (passport) => {
  passport.use(
    new localStorage(function (username, password, done) {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) console.log(err);
          if (match) {
            done(null, user);
          } else {
            done(null, false, { message: "Parol to'g'ri kelmadi" });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
