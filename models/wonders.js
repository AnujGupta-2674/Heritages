const mongoose = require("mongoose");

const wonderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Wonder = mongoose.model("Wonder", wonderSchema);

module.exports = Wonder;