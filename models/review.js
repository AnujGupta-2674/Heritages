const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;