//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/errordb", {
    useNewUrlParser: true,
});

const errorSchema = new mongoose.Schema({
    _id: Number,
    lang: {
        type: String,
        required: [true, "Please specify the language"]
    },
    error_domain: Array,
    errorKey: {
        type: String,
        required: [true, "Please specify the exact error you have encountered"]
    },
    res: String,
    documentation: String,
});

const Error = mongoose.model("Error", errorSchema);

// Error.insertMany([item1,item2,item3], (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully loaded");
//   }
// })

app.get("/", function (req, res) {
    Error.find({}, (err, query) => {

        // console.log(query);
        res.render("list", { resp: query });
    });
});


app.post("/", function (req, res) {
    const question = req.body.question;
    console.log(question);

    Error.find({errorKey: question}, (err, query) => {
        if (err) {
            console.log(err);
        } else {
            console.log(query[0].res);
            res.render("list", { resp: query });
            
        }
    });

    // res.render("list", { resp: query });
    
        // res.redirect("/");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});
