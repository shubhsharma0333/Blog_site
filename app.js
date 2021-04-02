

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to all bloggers stumbling upon this site i call the Diary of many, express your travels, expriences, motives or any articulation for all the people casually scrolling along you, To compose add '/compose' to the url your are currently at, Happy blogging ;)";
const aboutContent = "Hi i am shubh sharma a developer just making sites and just messing around.";
const contactContent = "For any queries contact me on shubhsharma0333@gmail.com or just leave a blog.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({        //initializing blog schema
  title: String,
  content: String
})

const Blog = mongoose.model("Blog", blogSchema);            //initializing mongoose model


app.get("/", function(req, res){
  Blog.find({}, function(err, result){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: result
        });
    }
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const blog = new Blog ({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  blog.save(function(err){
    if(!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:blogId", function(req, res){
  const requestedId = req.params.blogId;
  Blog.findOne({_id: requestedId}, function(err, result){
    res.render("post", {
      title: result.title,
      content: result.content
    });
  })


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
