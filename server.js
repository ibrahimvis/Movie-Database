require("dotenv").config();
const express        = require("express");
const expressLayouts = require("express-ejs-layouts");
const session        = require("express-session");
const mongoose       = require("mongoose");
const authRoutes     = require("./routes/auth.routes");
const adminRoutes    = require("./routes/admin.routes");
const userRoutes     = require("./routes/user.routes");
let passport         = require("./config/ppConfig");

const app = express();

mongoose.connect(process.env.MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    ()=> console.log(`Connected to the mongoDB successfully`),
    (err) => console.log(err)
);

mongoose.set("debug", true);

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(expressLayouts);


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    maxAge: Date.now() + (30 * 86400 * 1000)
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, done) {
    res.locals.user = req.user;
    done();
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);

app.listen(process.env.PORT, ()=>console.log(`Listening on port numer ${process.env.PORT}`));