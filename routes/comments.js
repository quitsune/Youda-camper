var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get('/new',middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
        console.log(err);
     }else{
     res.render('comments/new',{campground :foundCampground});
      
     }
    });
  });

  router.post('/',middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
        console.log(err);
     }else{
        Comment.create(req.body.comment, function(err,comment){
          if(err)
          {
            console.log(err);
          }
          else{

            //add username and id to the comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();// save comment
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect("/campgrounds/"+foundCampground._id);

          }
        });
      
      }
    });

  });

  router.get('/:comment_id/edit',middleware.checkCommentOwnership, (req, res) => {
        Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                      req.flash("error", "Campground not found");
                      res.redirect("back");
             }  else {
                      Comment.findById(req.params.comment_id,function(err, foundComment){
                          if(err){
                              res.redirect("back");
                           }else{
                              res.render('comments/edit',{campground_id :req.params.id, comment : foundComment});
      
                            }
                          });
                        }
    
  });
});

  router.put('/:comment_id',middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
      if(err){
        res.redirect("back");
     }else{
     res.redirect('/campgrounds/' +req.params.id);
      
     }
    });
  });


  router.delete('/:comment_id',middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id,req.body.comment,function(err){
      if(err){
        res.redirect("back");
     }else{
     res.redirect('/campgrounds/' +req.params.id);
      
     }
    });
  });


 

  module.exports = router;