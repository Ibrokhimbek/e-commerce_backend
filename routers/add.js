const express = require("express");
const DbProduct = require("../model/Product");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
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
    if (extname !== ".jpg" && extname !== ".jpeg" && extname !== ".png") {
      const err = new Error("xatolik bor");
      err.code = 404;
      return cb(err);
    }
    cb(null, true);
  },
  preservePath: true,
});

router.get("/", (req, res) => {
  res.render("add", {
    title: "Mahsulot qo'shish sahifasi",
  });
});

router.post("/", upload.single("photo"), (req, res) => {
  const db = new DbProduct({
    title: req.body.title,
    price: req.body.price,
    like: req.body.like,
    category: req.body.category,
    comments: req.body.comments,
    sale: req.body.sale,
    photo: req.file.path,
  });

  db.save((err) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
