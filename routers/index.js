const express = require("express");
const DbProduct = require("../model/Product");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/", (req, res) => {
  DbProduct.find({}, async (err, data) => {
    await fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((data) => data.json())
      .then((kurs) =>
        res.render("index", {
          title: "Bosh sahifa",
          datas: data,
          kurs,
        })
      );
    // res.render("index", {
    //   title: "Bosh sahifa",
    //   datas: data,
    // });
  });
});

router.get("/search", (req, res) => {
  let { search } = req.query;

  DbProduct.find({ title: { $regex: search } }, (err, dbData) => {
    fetch("http://cbu.uz/oz/arkhiv-kursov-valyut/json/")
      .then((data) => data.json())
      .then((kurs) => {
        if (dbData === [] || req.query.search == "") {
          res.redirect("/");
        } else {
          res.render("index", {
            title: "Bosh sahifa",
            datas: dbData,
            kurs,
          });
        }
      });
  });
});

router.post("/", (req, res) => {
  res.send("Salom main page");
});

module.exports = router;
