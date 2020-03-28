require("dotenv").config();
const express        = require("express");
const expressLayouts = require("express-ejs-layouts");
const session        = require("express-session");
const mongoose       = require("mongoose");
let passport         = require("./config/ppConfig");

const app = express();

mongoose.connect(process.env.MONGODB,
    {
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    ()=> console.log(`Connected to the mongoDB successfully`),
    (err) => console.log(err)
);

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(expressLayouts);


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 36000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res)=> res.render("index"));

app.listen(process.env.PORT, ()=>console.log(`Listening on port numer ${process.env.PORT}`));