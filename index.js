const express = require("express");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");
const routes = require("./routes/index");

const app = express();
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/urlShortener";
mongoose.Promise = global.Promise;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("Database Connection Error!!!" + err);
  });

// configuration
app.set("view engine", "ejs");
app.use(
  expressSession({
    secret: "secret message",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(routes);
app.use(express.static("./public"));

// listen on port
app.listen(process.env.PORT || 3000, () => {
  console.log("server up and running!!");
});
