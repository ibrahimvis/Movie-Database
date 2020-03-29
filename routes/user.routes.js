const router = require("express").Router();
const methodOverride = require("method-override");

let User  = require("../models/user.model");
let Movie = require("../models/movie.model");

let isLoggedIn = require("../config/isLoggedIn");
let passport = require("../config/ppConfig");

router.use(methodOverride("_method"));

router.get("/", (req, res)=> {
    if (req.user)
        if (req.user.isAdmin) {
            res.redirect("/admin");
        }

    Movie.find()
    
    .then(movies => {
        res.render("index", { movies });
    })
    
    .catch(err => {
        console.log(err);
        res.send("Check the logs")
    });
});

router.get("/show/:id", (req, res) => {
    //Movie.findById()
});

module.exports = router;