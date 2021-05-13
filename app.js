const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");

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

const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("home", {homeStartingContent, posts});
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

app.post("/compose", (req, res)=>{
    const post = {
        title: req.body.postTitle,
        content: req.body.postText
    };

    posts.push(post);

    res.redirect("/");
});

app.get("/posts/:postName", (req, res)=>{
    let sent = false;
    posts.forEach((item)=>{
        if(_.lowerCase(item.title)===_.lowerCase(req.params.postName)){
            res.render("post", {title: item.title, content: item.content});
            sent = true;
        }
    });
    if(!sent){
        res.render("404");
    }
});

app.get("/posts/:postName/edit", (req, res)=>{
    let sent = false;
    posts.forEach((item)=>{
        if(_.lowerCase(item.title)===_.lowerCase(req.params.postName)){
            res.render("edit", {title: item.title, content: item.content});
            sent = true;
        }
    });
    if(!sent){
        res.render("404");
    }
});

app.post("/posts/:postName/edit", (req, res)=>{
    posts.forEach((item, index)=>{
        if(_.lowerCase(item.title)===_.lowerCase(req.params.postName)){
            posts[index].title = req.body.postTitle; 
            posts[index].content = req.body.postText;
        }
    });
    res.redirect("/");
});

app.get("/posts/:postName/delete", (req, res)=>{
    posts.forEach((item, index)=>{
        if(_.lowerCase(item.title)===_.lowerCase(req.params.postName)){
            posts.splice(index,1);
        }
    });
    res.redirect("/");
});

app.get("*", (req, res)=>{
    res.render("404");
});

app.listen(port, function(){
    console.log(`Server started at port ${port}`)
});