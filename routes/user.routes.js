const router = require("express").Router();
const methodOverride = require("method-override");

let User = require("../models/user.model");
let Movie = require("../models/movie.model");
let Status = require("../models/status.model");

let isLoggedIn = require("../config/isLoggedIn");
let passport = require("../config/ppConfig");

router.use(methodOverride("_method"));

router.get("/", (req, res) => {
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
    Movie.findById(req.params.id)

        .then(movie => {
            res.render("user/show", { movie })
        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs");
        });
});

router.post("/user/addmovie/", (req, res) => {

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
                if (element.movie._id == req.body.movie_id) {
                    res.send("Movie exsits in your watchlist");
                    x = !x;
                }
            }

            if (x) {
                let status = new Status();

                status.movie = req.body.movie_id;
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
                                    res.send(result);
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

    // let status = new Status();

    // status.movie = req.body.movie_id;
    // status.status = "towatch";

    // status.save()

    //     .then((s) => {
    //         //let obj = { movie: req.body.movie_id, status: "towatch" }
    //         User.findByIdAndUpdate(req.user,
    //             { $push: { "status": s._id } },
    //             { safe: true, upsert: true },
    //             function (err, result) {
    //                 if (err) {
    //                     res.send(err);
    //                 } else {
    //                     res.send(result);
    //                 }
    //             }
    //         )
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.send("Check the logs");
    //     });


    // User.findByIdAndUpdate(req.user.id, {
    //     $push: { movies: req.body.movie_id }
    // }, { 'new': true })

    //     .then(user => {
    //         //console.log(req.user);

    //         res.send(user);


    //     })

    //     .catch(err => {
    //         console.log(err);
    //         res.send("Check the logs");
    //     });
});


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

module.exports = router;