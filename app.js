var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Seed the database.
// seedDB();

//mongoose.connect("mongodb://localhost/yelpcamp");

// Display DATABASEURL environment variable.
// console.log(process.env.DATABASEURL);

var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp";

mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
}).then(() => {
	console.log("connected to mongoDB");
}).catch(err => {
	console.log("Error:", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "A secret field",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// Campground.create(
//     {name: "Salmon Creek", image: "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg", description: "this is a huge hill"},
//  function(err, campground){
// 	if(err){
// 	   console.log(err);
// 	} else {
// 		console.log("newly created campground");
// 		console.log(campground);
// 	}
// });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
