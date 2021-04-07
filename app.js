const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const rIndex = require("./routers/index");
const rAdd = require("./routers/add");
const app = express();

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

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use('/', rIndex);
app.use('/add', rAdd);

app.listen(3000, () => {
  console.log("Server is running on 3000 port");
});
