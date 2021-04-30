const express = require("express");
const DbProduct = require("../model/Product");
const DbUsers = require("../model/User");
const router = express.Router();

const def = (req, res, next) => {
  if(req.isAuthenticated()) {
    next()
  }else{
    req.flash("danger", "Iltimos ro'yxatdan o'ting")
    res.redirect('/user/login')
  }
};

router.get("/edit/:id", def, (req, res) => {
  DbProduct.findById(req.params.id, (err, data) => {
    res.render("edit", {
      title: "Product edit page",
      db: data,
    });
  });
});

router.get("/cards/:id",def, (req, res) => {
  DbProduct.findById(req.params.id, (err, data) => {
    DbUsers.findById(data.author, (err, user)=>{

      res.render("product", {
        title: "Product page",
        db: data,
        name: user.name
      });
    })
  });
});

router.get("/delete/:id",def, (req, res) => {
  DbProduct.deleteOne({ _id: req.params.id }, (err, data) => {
    req.flash("danger", "Item was deleted");
    res.redirect("/");
  });
});

module.exports = router;
