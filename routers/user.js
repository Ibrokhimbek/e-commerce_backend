const express = require("express");
const DbProduct = require("../model/Product");
const DbUsers = require("../model/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/user/register", (req, res) => {
  res.render("register", {
    title: "Ro'yxatdan o'tish",
  });
});

router.post(
  "/user/register",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/register",
    failureFlash: true,
    failureFlash: "Registration failed",
    successFlash: "Successfully registered",
  }),
  (req, res) => {
    req.checkBody("name", "Ismingizni kiriting").notEmpty();
    req.checkBody("username", "Usernamemingizni kiriting").notEmpty();
    req.checkBody("email", "Emailingizni kiriting").notEmpty();
    req.checkBody("password", "Parolingizni kiriting").notEmpty();
    req
      .checkBody("password2", "Parolingiz to'g'ri kelmadi")
      .equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      res.render("register", {
        title: "Xatolik bor",
        errors: errors,
      });
    } else {
      const db = new DbUsers({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, pass) => {
        bcrypt.hash(db.password, pass, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            db.password = hash;
            db.save((err) => {
              if (err) {
                throw new Error();
              } else {
                req.flash("success", "Ro'yxatdan o'tdingiz");
                res.redirect("/");
              }
            });
          }
        });
      });
    }
  }
);

router.get("/user/login", (req, res) => {
  res.render("login", {
    title: "Tizimga kirish",
  });
});

router.post(
  "/user/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
    failureFlash: "Incorrect username or password",
    successFlash: "Connected to the Server",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Disconnected from the server");
  res.redirect("/");
});

module.exports = router;
