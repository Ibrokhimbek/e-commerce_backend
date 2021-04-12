const express = require("express");
const DbProduct = require("../model/Product");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/", (req, res) => {
  DbProduct.find({}, (err, data) => {
    fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((data) => data.json())
      .then((body) =>
        res.render("index", {
          title: "Bosh sahifa",
          datas: data,
          kurs: body,
        })
      );
  });
});

router.get("/search", (req, res) => {
  let { search } = req.query;

  DbProduct.find({ title: { $regex: search } }, (err, data) => {
    fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((data) => data.json())
      .then((body) => {
        if (data === [] || req.query.search == "") {
          console.log(data);
          res.redirect("/");
        } else {
          res.render("index", {
            title: "Bosh sahifa",
            datas: data,
            kurs: body,
          });
        }
      });
  });
});

router.post("/", (req, res) => {
  res.send("Salom main page");
});

module.exports = router;
