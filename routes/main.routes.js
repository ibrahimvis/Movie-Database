const router = require("express").Router();

let User = require("../models/user.model");
let Movie = require("../models/movie.model");

router.get("/home", (req, res) => {
    

    Movie.find()

        .then(movies => {
            res.render("index", { movies });
        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs")
        });


});

router.get("/", (req, res) => {

    Movie.find()

        .then(movies => {
            let top5 = [];
            let trend = [];
            movies.forEach(movie => {
                if (movie.isTrending) {
                    trend.push(movie);
                }
                if (movie.isTop5) {
                    top5.push(movie);
                }
            });

            res.render("home", { top5: top5, trend: trend });

        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs");
        })
});

/**
 * 
 * search by name
 * 
 */

router.get("/:search", (req, res) => {
    if (req.params.search) {
        Movie.find({ "name": { "$regex": req.params.search, "$options": "i" } })

        .then(movies => {
            res.render("index", { movies });
        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs")
        });
    }
});

/**
 * 
 * search by catagory
 * 
 */

router.get("/home/:search", (req, res) => {
    if (req.params.search) {
        Movie.find({ "catagory": { "$regex": req.params.search, "$options": "i" } })

        .then(movies => {
            res.render("index", { movies });
        })

        .catch(err => {
            console.log(err);
            res.send("Check the logs")
        });
    }
});

module.exports = router;