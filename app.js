
var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
  //  mongoose = require("mongoose"),
    MongoClient = require("mongodb").MongoClient,
    app = express();

//Database in Mongodb named Assignment7
var dburl = 'mongodb://localhost:27017/Homework7';

//Starting App
http.createServer(app).listen(3000);
console.log("Listenning to port 3000!");

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


//GET all links route:
app.get("/links", function (req, res) {
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            console.warn(err.message);
        }
        else {
            var collection = db.collection('links');
            collection.find().toArray(function (err, items) {
                res.json(items);
            });
        }
    });
});

//POST links route:
app.post("/links", function (req, res) {
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("Failed to connect to the db");
        }
        else {
            var link = req.body.linkText;
            var title = req.body.titleText;
            var collection = db.collection('links');
            collection.insert({title: title, link: link, clicks: 0 }, function (err, result) {
                console.log("Successfully created and updated the Database");
                res.json({"Status" : "Successfully Inserted Data to Database, Please check http://localhost:3000/links"});
            });
        }
    });
});

//GET clicks route:
app.get("/click/:title", function (req, res) {
    MongoClient.connect(dburl, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("failed to connect to the db");
        }
        else {
            var collection = db.collection('links');
            collection.findAndModify(
                { title: req.params.title },
                [],
                {
                  $inc:
                    { clicks: 1 }
                },
                {new: true},
                function (err, object) {
                    if (err) {
                        console.warn(err.message);
                    } else {

                        console.log("Successfully Updated the clicks");
                        res.redirect(object.value.link);
                    // res.json({"Status" : "Successfully Updated the Clicks"});
                    }
                });
            }

    });

});
