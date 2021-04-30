const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const rIndex = require("./routers/index");
const rAdd = require("./routers/add");
const rProduct = require("./routers/product");
const rUser = require("./routers/user");
const expressValidator = require("express-validator");
const session = require("express-session");

const app = express();

// Setting Express Validator

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split(".");
      root = namespace.shift();
      formParam = root;

      while (namespace.length) {
        formParams += "[" + namespace.shift() + "]";
      }
      return {
        params: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Setting mongoose

mongoose.connect(
  "mongodb+srv://Ibrokhim:IbrohimbekTuraboyev@ibrokhimdb.szcqn.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;

db.on("open", () => {
  console.log("MongoDB is working");
});

db.on("error", (err) => {
  console.log("There is something is going wrong");
});

// Setting engine

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Setting BodyParser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting static folder
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));
// app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Authentication
require("./middleware/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", rIndex);
app.use("/", rAdd);
app.use("/", rProduct);
app.use("/", rUser);

app.listen(3000, () => {
  console.log("Server is running on 3000 port");
});
