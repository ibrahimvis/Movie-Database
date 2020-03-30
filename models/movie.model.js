const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
    name: String,
    url: String,
    image: String,
    catagory: String,
    desc: String,
    
    isTop5: {
        type: Boolean,
        default: false
    },

    isTrending: {
        type: Boolean,
        default: false
    }
});

let Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;