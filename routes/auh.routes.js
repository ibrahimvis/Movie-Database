const router = require("express").Router();

let isLoggedIn = require("../config/isLoggedIn");
let passport = require("../config/ppConfig");

let User = require("../models/user.model");
let Movie = require("../models/movie.model");

router.get("/auth/signup", (req, res) => {
    res.render("auth/signup");
});

router.post("/auth/signup", (req, res) => {
    let user = new User(req.body);

    user.save().then((u) => {

        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/auth/signup"
        })(req, res);

    }).catch(err => {
        console.log(err);
        res.send("Check the logs");
    });
});


router.get("/auth/login", (req, res) => {
    res.render("auth/login")
});

router.post("/auth/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login"
    })
);


router.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/")
});

module.exports = router;