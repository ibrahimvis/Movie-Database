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
    let movie = new Movie(req.body);
    movie.save()
        .then(() => {
            res.redirect("/admin");
        })
        .catch(err => {
            console.log(err);
            res.send("Check the logs");
        });
})

router.delete("/delete/:id", (req, res) => {
    Movie.findByIdAndDelete(req.params.id).then(movie => {
        res.redirect("/admin");
    });
});

module.exports = router;