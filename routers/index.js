const express = require("express");
const DbProduct = require("../model/Product");
const router = express.Router();

router.get("/", (req, res) => {
  DbProduct.find({}, (err, data) => {
    res.render("index", {
      title: "Bosh sahifa",
      datas: data,
    });
  });
});

router.get("/search", (req, res) => {
  let { search } = req.query;
  console.log(search);

  DbProduct.find({ title: search }, (err, data) => {
    if(data = []) {
      res.redirect('/')
    }else {
      res.render("index", {
        title: "Bosh sahifa",
        datas: data,
      });
    }
    
  });
});

router.post("/", (req, res) => {
  res.send("Salom main page");
});

module.exports = router;
