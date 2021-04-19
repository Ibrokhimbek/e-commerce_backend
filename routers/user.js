const express = require('express')
const DbUsers = require('../model/User')
const router = express.Router();

router.get('/register', (req,res)=> {
    res.render('register', {
        title: "Ro'yxatdan o'tish",
    })
})

module.exports = router