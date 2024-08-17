const express = require("express");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { redirectUrl } = require("../middlewares.js");

// Set up passport local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            username: username,
            email: email,
        });

        const registerdUser = await User.register(newUser, password);
        console.log(newUser);

        req.login(registerdUser, (err) => {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong. Please try again.");
                return res.redirect("/signup");
            } else {
                req.flash("success", "Welcome to world heritages");
                res.redirect("/wonders");
            }

        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.post("/login", redirectUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/signup" }), async (req, res) => {
    let redirect = res.locals.url || "/wonders";
    req.flash("success", "Welcome user to 7 wonders");
    res.redirect(redirect);
});

router.get("/logout", async (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "You are logged out from 7 wonders");
            res.redirect("/wonders");
        }
    });
});



module.exports = router;
