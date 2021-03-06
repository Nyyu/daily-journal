//jshint esversion:6

// Modules
const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const { redirect } = require("express/lib/response");
const { lt } = require("lodash");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/dailyjornalDB");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});
const postModel = mongoose.model("post", postSchema);

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(express.static(__dirname + "/public"));
app.use(bp.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    let title, content;
    // const posts = [];
    postModel.find({}, { title: 1, text: 1, _id: 1 }, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        content = {
            mainText: homeStartingContent,
            array: result,
        };
        title = "Home";
        res.render(title.toLowerCase(), { content: content, title: title });
    });
});

app.get("/about", (req, res) => {
    let title, content;
    content = aboutContent;
    title = "About";

    res.render(title.toLowerCase(), { content: content, title: title });
});

app.get("/contact", (req, res) => {
    let title, content;
    content = contactContent;
    title = "Contact";

    res.render(title.toLowerCase(), { content: content, title: title });
});

app.get("/compose", (req, res) => {
    res.render("compose", { title: "Compose" });
});

app.post("/compose", (req, res) => {
    // posts.push({
    //     title: req.body.title,
    //     text: req.body.text,
    // });
    const temp = new postModel({
        title: _.lowerCase(req.body.title),
        text: req.body.text,
    });

    temp.save((err) => {
        if (err) {
            console.error(err);
            return;
        }

        res.redirect("/");
    });
});

app.get("/post", (req, res) => {
    res.redirect("/");
});

// app.get("/post/:title-:subtitle", (req, res) => {
//     let title, content;
//     postModel.find(
//         {
//             title: `${_.lowerCase(req.params.title)} ${_.lowerCase(
//                 req.params.subtitle
//             )}`,
//         },
//         { title: 1, text: 1, _id: 0 },
//         (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             title = result[0].title;
//             content = result[0].text;
//             res.render("post", { title: title, content: content });
//         }
//     );
// });

app.get("/post/:title", (req, res) => {
    let title, content;
    postModel.find(
        { _id: req.params.title },
        { title: 1, text: 1, _id: 1 },
        (err, result) => {
            title = result[0].title;
            content = result[0].text;
            if (!err) res.render("post", { title: title, content: content });
        }
    );
});

app.listen(process.env.PORT || 3000, () =>
    console.log(`[+] Runnin' at http://127.0.0.1:${process.env.PORT || 3000}`)
);
