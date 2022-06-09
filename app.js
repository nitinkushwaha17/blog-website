if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const Post = require("./models/post");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/blog';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected!");
});

const port = process.env.PORT || 3000;

const homeStartingContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis.";

const aboutContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis.";

const contactContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis." +
"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum dolorem nostrum pariatur sed saepe, similique iste corrupti delectus aliquam officia alias inventore distinctio laboriosam in ea debitis, harum voluptatum perferendis.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async (req, res)=>{
    const post = await Post.find({});
    res.render("home", {homeStartingContent, post});
});
app.get("/about", (req, res)=>{
    res.render("about", {aboutContent});
});

app.get("/contact", (req, res)=>{
    res.render("contact", {contactContent});
});

app.get("/compose", (req, res)=>{
    res.render("compose");
});

app.post("/compose", async (req, res)=>{
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postText
    });

    await post.save();

    res.redirect("/");
});

app.get("/posts/:postName", async (req, res)=>{
    try{
        const post = await Post.find({title: req.params.postName});
        res.render("post", {title: post[0].title, content: post[0].content});
    }
    catch(err){
        console.log(err);
        res.render("404");
    }
});

app.get("/posts/:postName/edit", async (req, res)=>{
    try{
        const post = await Post.find({title: req.params.postName});
        res.render("edit", {title: post[0].title, content: post[0].content});
    }
    catch(err){
        console.log(err);
        res.render("404");
    }
});

app.post("/posts/:postName/edit", async (req, res)=>{
    await Post.updateOne({title: req.params.postName}, {title: req.body.postTitle, content: req.body.postText});
    res.redirect(`/posts/${req.body.postTitle}`);
});

app.get("/posts/:postName/delete", async (req, res)=>{
    await Post.deleteOne({title: req.params.postName});
    res.redirect("/");
});

app.get("/secret", (req, res)=>{
    res.render("secret");
});

app.get("*", (req, res)=>{
    res.render("404");
});

app.listen(port, function(){
    console.log(`Server started at port ${port}`);
});