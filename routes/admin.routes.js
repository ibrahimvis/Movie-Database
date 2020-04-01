const router = require("express").Router();
const methodOverride = require("method-override");

let isLoggedIn = require("../config/isLoggedIn");
let passport = require("../config/ppConfig");

let User = require("../models/user.model");
let Movie = require("../models/movie.model");

router.use(methodOverride("_method"));

router.get("/admin", isLoggedIn, (req, res) => {

    if (!req.user.isAdmin)
        res.redirect("/");
    else {
        Movie.find()
            .then((movies) => {
                res.render("admin/index", { movies });
            })

            .catch(err => {
                console.log(err);
                res.send("Check the logs");
            });
    }

});

router.post("/admin/addmovie", isLoggedIn, (req, res) => {
    console.log(req.body);
    
    let movie = new Movie(req.body);

    movie.save()
        .then(() => {
            res.redirect("/admin");
        })
        .catch(err => {
            console.log(err);
            res.send("Check the logs");
        });
});

router.get("/edit/:id", (req, res) => {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            console.log(err);
            res.send(500, {error: err});
        }

        res.render("admin/edit", {movie})
    });
});

router.put("/edit/:id", isLoggedIn, (req, res) => {
    let desc = req.body.desc;
    let isTrending = req.body.isTrending;
    let isTop5 = req.body.isTop5;
    Movie.findByIdAndUpdate(req.params.id, {desc, isTop5, isTrending}, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500, {error: err});
        }
        res.redirect("/admin");
    });
});

router.delete("/delete/:id", isLoggedIn, (req, res) => {
    Movie.findByIdAndDelete(req.params.id).then(movie => {
        res.redirect("/admin");
    });
});

module.exports = router;