const express = require("express");
const DbProduct = require("../model/Product");
const upload = require("../middleware/multer").single("photo");
const path = require("path");
const fetch = require("node-fetch");
const router = express.Router();

const def = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Iltimos ro'yxatdan o'ting");
    res.redirect("/user/login");
  }
};

router.get("/add", def, (req, res) => {
  fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
    .then((data) => data.json())
    .then((body) => {
      res.render("add", {
        title: "Mahsulot qo'shish sahifasi",
        kurs: body,
      });
    });
});

router.post("/add", upload, (req, res) => {
  req.checkBody("title", "Mahsulotning nomini kiriting").notEmpty();
  req.checkBody("price", "Mahsulotning narxini kiriting").notEmpty();
  req.checkBody("category", "Mahsulotning sinfini kiriting").notEmpty();
  req.checkBody("comments", "Mahsulotning haqida ma'lumot kiriting").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.render("add", {
      title: "Xatolik bor",
      errors: errors,
    });
  } else {
    const db = new DbProduct({
      title: req.body.title.toLowerCase(),
      price: req.body.price,
      like: req.body.like,
      category: req.body.category,
      comments: req.body.comments,
      sale: req.body.sale,
      photo: req.file.path,
      author: req.user._id,
    });

    db.save((err) => {
      if (err) {
        req.flash("danger", "Mahsulotni qayta yuklang");
        res.redirect("/add");
      } else {
        req.flash("success", "Mahsulot yuklandi");
        res.redirect("/");
      }
    });
  }
});

router.post("/edit/:UserId", upload, (req, res) => {
  req.checkBody("title", "Mahsulotning nomini kiriting").notEmpty();
  req.checkBody("price", "Mahsulotning narxini kiriting").notEmpty();
  req.checkBody("category", "Mahsulotning sinfini kiriting").notEmpty();
  req.checkBody("comments", "Mahsulotning haqida ma'lumot kiriting").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.render("add", {
      title: "Xatolik bor",
      errors: errors,
    });
  } else {
    const db = {
      title: req.body.title.toLowerCase(),
      price: req.body.price,
      like: req.body.like,
      category: req.body.category,
      comments: req.body.comments,
      sale: req.body.sale,
      photo: req.file.path,
    };

    const ids = { _id: req.params.UserId };
    DbProduct.updateOne(ids, db, (err) => {
      if (err) {
        throw err;
      } else {
        req.flash("success", "Mahsulot yuklandi");
        res.redirect("/");
      }
    });
  }
});

router.post("/:id", (req, res) => {
  DbProduct.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      data.like += 1;
      data.save();
      res.send(data);
    }
  });
});

module.exports = router;
