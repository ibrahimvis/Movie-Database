require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
let passport = require("./config/ppConfig");
let isLoggedIn = require("./config/isLoggedIn");

const flash = require("connect-flash");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const mainRoutes = require("./routes/main.routes");

let User = require("./models/user.model");
let Movie = require("./models/movie.model");

const app = express();

mongoose.connect(process.env.MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => console.log(`Connected to the mongoDB successfully`),
    (err) => console.log(err)
);

mongoose.set("debug", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(expressLayouts);


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // maxAge: Date.now() + (30 * 86400 * 1000),
    store: new MongoStore({url:process.env.MONGODB})
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, done) {
    res.locals.alerts = req.flash();
    res.locals.user = req.user;
    res.locals.images=["./images/78.jpg","/images/79.jpg"]
    res.locals.r = Math.floor(Math.random() * Math.floor(2));
    done();
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(mainRoutes);

app.listen(process.env.PORT, () => console.log(`Listening on port numer ${process.env.PORT}`));