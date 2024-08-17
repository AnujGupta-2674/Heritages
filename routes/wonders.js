const express = require("express");
const Wonder = require("../models/wonders.js");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middlewares.js");
const { isOwner } = require("../middlewares.js");

router.get("/wonders", async (req, res) => {
    let allWonder = await Wonder.find();
    res.render("home.ejs", { allWonder });
});

router.get("/wonders/:id/show", async (req, res) => {
    let { id } = req.params;
    let wonder = await Wonder.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    res.render("show.ejs", { wonder });
});

router.get("/wonders/new", isLoggedIn, (req, res) => {
    res.render("form.ejs");
});

router.post("/wonders", async (req, res) => {
    let newWonder = new Wonder(req.body.wonder);
    newWonder.owner = res.locals.currUser._id;
    await newWonder.save();
    req.flash("success", "New gem Added");
    res.redirect("/wonders");
});

router.get("/wonders/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let wonder = await Wonder.findById(id);
    res.render("edit.ejs", { wonder });
});

router.post("/wonders/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let wonder = await Wonder.findByIdAndUpdate(id, { ...req.body.wonder });
    res.redirect(`/wonders/${id}/show`);
});

module.exports = router;