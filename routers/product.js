const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();

router.get("/edit/:id", (req, res) => {
  DbProduct.findById(req.params.id, (err, data) => {
    res.render("edit", {
      title: "Product edit page",
      db: data,
    });
  });
});

router.get("/:id", (req, res) => {
  DbProduct.findById(req.params.id, (err, data) => {
    res.render("product", {
      title: "Product page",
      db: data,
    });
  });
});

router.get("/delete/:id", (req, res) => {
  DbProduct.deleteOne({ _id: req.params.id }, (err, data) => {
    res.redirect("/");
  });
});

module.exports = router;
