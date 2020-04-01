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
            failureRedirect: "/auth/signup",
            successFlash: "Account created and You have logged In!"
        })(req, res);

    }).catch(err => {
        if (err.code != 11000) {
            res.send(500, {error:err});
        } else {
            console.log("Email Exists");
            req.flash("error", "Email Exists");
            return res.redirect("/auth/signup");
        }

        
    });
});


router.get("/auth/login", (req, res) => {
    res.render("auth/login")
});

router.post("/auth/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: "Invalid Username or Password",
        successFlash: "You have logged In!"
    })

);


router.get("/auth/logout", (req, res) => {
    req.logout();
    req.flash("success", "See you soon!");
    res.redirect("/")
});

module.exports = router;