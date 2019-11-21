
var Campground = require("../models/campground");
var Comment = require("../models/comment");



// All middleware goes here.

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    	//is user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		    if(err){
				req.flash("error", "campground not found")	
		        res.redirect("back");
		    } else {
				// Does the user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
				   next();
				} else {
					req.flash("error", "you don't have permission")	
					res.redirect("back");
				}
		    }
	});
	} else {
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // Is the user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		    if(err){
		       res.redirect("back");
		    } else {
				// Does the user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
				   next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
		    }
	});
	} else {
		req.flash("error", "you need to be logged in");
		res.redirect("back");
	}
};


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	}
	req.flash("error", "please log in first");
	res.redirect("/login");
};








module.exports = middlewareObj;