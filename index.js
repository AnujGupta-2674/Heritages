const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Wonder = require("./models/wonders.js");
const User = require("./models/user.js");
const wonder = require("./routes/wonders.js");
const ejsMate = require("ejs-mate");
const user = require("./routes/user.js");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./ExpressError.js");
const flash = require('connect-flash');
const review = require("./routes/review.js");
const methodOverride = require('method-override');
require('dotenv').config();
const MongoStore = require('connect-mongo');


const app = express();
const port = 3000;

//Middlewares and Session goes here
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

//Mongoose Connection
const dbUrl = process.env.ATLASDB_URL;

//MongoStore goes here
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}));

app.use(methodOverride('_method'))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

main().then(() => console.log("Connected to MongoDb"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.get("/", (req, res) => {
    res.send("Hii I am root");
});

app.use("/", wonder);
app.use("/", user);
app.use("/wonders/:id/reviews", review);

app.all("*", (req, res, next) => {
    throw next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal Sever Error" } = err;
    res.render("error.ejs", { message });
});

const init = async () => {
    const newWonder = new Wonder({
        name: "Taj Mahal",
        title: "The Symbol of Love",
        image: "https://www.travelandleisure.com/thmb/wdUcyBQyQ0wUVs4wLahp0iWgZhc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/taj-mahal-agra-india-TAJ0217-9eab8f20d11d4391901867ed1ce222b8.jpg",
        description: "The Taj Mahal is a stunning white marble mausoleum in Agra, India, built by Emperor Shah Jahan between 1632 and 1648 in memory of his wife Mumtaz Mahal. It is celebrated for its exquisite Mughal architecture, featuring a grand dome, minarets, and intricate carvings. As a UNESCO World Heritage Site, it is one of the New Seven Wonders of the World and attracts millions of visitors annually.",
        country: "India",
    });

    newWonder.owner = "66be21d9485e38356dc607d0";
    await newWonder.save().then((res) => { console.log(res) }).catch((err) => { console.log(err) });
}


//Listening
app.listen(port, () => {
    console.log(`App is listening on port:${port}`);
});