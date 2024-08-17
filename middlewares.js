const Wonder = require("./models/wonders.js");
const User = require("./models/user.js");
const Review = require("./models/review.js");

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to make anychanges");
        return res.redirect("/login");
    }
    next();
}

// Middleware to handle redirect URL after login
const redirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.url = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear redirect URL after using it
    }
    next();
}

const isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot delete the review because you are not the author");
        return res.redirect(`/wonders/${id}/show`);
    }
    next();
}

const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let wonder = await Wonder.findById(id);
    if (!wonder.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot edit this Listing as you are not the owner");
        return res.redirect(`/wonders/${id}/show`);
    }
    next();
}

module.exports = { isLoggedIn, redirectUrl, isAuthor, isOwner };
