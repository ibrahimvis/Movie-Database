const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    status: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Status"
        }
    ]
});

userSchema.pre("save", function (next) {
    let user = this;
    if (!user.isModified("password")) {
        return next();
    }

    let hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    next();
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;