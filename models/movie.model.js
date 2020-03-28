const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
    name: String,
    url: String,
    image: String,
    catagory: String
});

let Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;