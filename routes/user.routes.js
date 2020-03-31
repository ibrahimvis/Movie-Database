const router = require("express").Router();
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");

let User = require("../models/user.model");
let Movie = require("../models/movie.model");
let Status = require("../models/status.model");

let isLoggedIn = require("../config/isLoggedIn");
let passport = require("../config/ppConfig");

router.use(methodOverride("_method"));

router.get("/user/addmovie/:id", (req, res) => {

    User.findById(req.user._id).populate({
        path: 'status',
        populate: {
            path: 'movie',
            model: 'Movie'
        }
    }).exec(function (err, user) {
        if (err) {
            console.log(err);
            res.send("Check the logs");
        }

        else {
            let x = true;
            for (let index = 0; index < user.status.length; index++) {
                var element = user.status[index];
                if (element.movie._id == req.params.id) {
                    res.send("Movie exsits in your watchlist");
                    x = !x;
                }
            }

            if (x) {
                let status = new Status();

                status.movie = req.params.id;
                status.status = "towatch";

                status.save()

                    .then((s) => {
                        User.findByIdAndUpdate(req.user._id,
                            { $push: { "status": s._id } },
                            { safe: true, upsert: true },
                            function (err, result) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.redirect("/user/profile");
                                }
                            }
                        )
                    })

                    .catch(err => {
                        console.log(err);
                        res.send("Check the logs");
                    });
            }
        }

    });
});

router.get("/show/:id", (req, res) => {
    Movie.findById(req.params.id)

        .then(movie => {
            if (!req.user)
                res.render("user/show", { movie });
            else {
                User.findById(req.user._id).populate({
                    path: 'status',
                    populate: {
                        path: 'movie',
                        model: 'Movie'
                    }
                }).then(user => {
                    user.status.forEach(element => {
                        if (movie._id == element.movie_id) {
                            res.render("user/show", {movie, stat: element.status});
                        }
                    })

                    res.render("user/show", {movie, stat: "towatch"});
                }).catch(err => {
                    console.log(err);
                    res.send(500, {error: err});
                });
                
            }
        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs");
        });
});

// router.get("/user/like")


router.get("/user/watchlist", isLoggedIn, (req, res) => {
    User.findById(req.user._id).populate({
        path: 'status',
        populate: {
            path: 'movie',
            model: 'Movie'
        }
    }).exec(function (err, user) {
        if (err) {
            console.log(err);
            res.send("Check the logs");
        }

        else {
            res.render("user/watchlist", { status: user.status })
        }

    });
});


router.get("/user/edit", isLoggedIn, (req, res) => {
    res.render("user/edit");
});

router.put("/user/edit", isLoggedIn, (req, res) => {
    let pass = bcrypt.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(req.user._id, { $set: { password: pass } },
        function (err, user) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            }

            res.redirect("/");
        }
    )
});


router.get("/user/profile/delete/:id", isLoggedIn, (req, res) => {

    User.findById(req.user._id)

        .exec(function (err, user) {
            if (err) {
                console.log(err);
                res.send("Check the logs");
            }

            else {
                user.status.remove(req.params.id);
                user.save()

                    .then(() => {
                        res.redirect("/user/profile/");
                    })

                    .catch(err => {
                        console.log(err);
                        res.send("check the logs");
                    });
            }
        });
});

router.get("/user/profile", isLoggedIn, (req, res, next) => {

    if (req.user.isAdmin) {
        res.redirect("/admin");
        next();
    }

    User.findById(req.user._id).populate({
        path: 'status',
        populate: {
            path: 'movie',
            model: 'Movie'
        }
    }).exec(function (err, user) {
        if (err) {
            console.log(err);
            res.send("Check the logs");
        }
        else {
            res.render("user/profile", { status: user.status })
        }
    });
});


module.exports = router;