const express = require("express");
const Review = require("../models/review.js");
const Wonder = require("../models/wonders.js");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middlewares.js");
const { isAuthor } = require("../middlewares.js");

router.post("/", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let wonder = await Wonder.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    wonder.reviews.push(newReview);
    await newReview.save();
    await wonder.save();
    req.flash("success", "New Review Added");
    res.redirect(`/wonders/${id}/show`);
});

router.delete("/:reviewId", isAuthor, async (req, res) => {
    let { id, reviewId } = req.params;
    await Wonder.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/wonders/${id}/show`);
});

module.exports = router;