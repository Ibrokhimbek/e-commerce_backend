const express = require("express");
const DbProduct = require("../model/Product");
const multer = require("multer");
const path = require("path");
const fetch = require("node-fetch");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 2 * 1024 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (
      extname !== ".jpg" &&
      extname !== ".jpeg" &&
      extname !== ".png" &&
      extname !== ".JPG" &&
      extname !== ".JPEG" &&
      extname !== ".PNG"
    ) {
      const err = new Error("Rasm formati to'g'ri kelmadi");
      err.code = 404;
      return cb(err);
    }
    cb(null, true);
  },
  preservePath: true,
});

router.get("/add", (req, res) => {
  fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
    .then((data) => data.json())
    .then((body) => {
      res.render("add", {
        title: "Mahsulot qo'shish sahifasi",
        kurs: body,
      });
    });
});

router.post("/add", upload.single("photo"), (req, res) => {
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
    });

    db.save((err) => {
      if (err) {
        req.flash("danger", "Mahsulotni qayta yuklang")
        res.redirect("/add")
      } else {
        req.flash("success", "Mahsulot yuklandi");
        res.redirect("/");
      }
    });
  }
});

router.post("/edit/:UserId", upload.single("photo"), (req, res) => {
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

router.post('/:id', (req,res)=> {
  DbProduct.findById(req.params.id, (err,data)=> {
    if(err){
      console.log(err)
    }else{
      data.like += 1
      data.save()
      res.send(data)
    }
  })
})

module.exports = router;
