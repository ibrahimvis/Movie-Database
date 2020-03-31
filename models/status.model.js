const mongoose = require("mongoose");

let statusSchema = mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["towatch", "like", "dislike"],
        default : 'towatch'
    }
});

let Status = mongoose.model("Status", statusSchema);

module.exports = Status;