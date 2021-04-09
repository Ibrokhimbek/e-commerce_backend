const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();

router.get("/", (req, res) => {
  DbProduct.find({}, (err, data) => {
    console.log(data)
    res.render("index", {
      title: "Bosh sahifa",
      datas: data,
    });
  });
});

router.post("/", (req, res) => {
  res.send("Salom main page");
});

module.exports = router;
