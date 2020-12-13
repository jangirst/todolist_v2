//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "No item added."]
  }
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist App."
});

const item2 = new Item({
  name: "You can add items by clicking the + sign."
});

const item3 = new Item({
  name: "Check the items your finished with."
})

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find(function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully added the default items to Items collection.");
          }
        });
        res.redirect("/");

      } else {
        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems
        });
      }
    }
  });

});

app.post("/", function(req, res) {

  const newItem = new Item({
    name: req.body.newItem
  });

  newItem.save();

  res.redirect("/");

});

app.post("/delete", function(req, res) {

  // Item.deleteOne({_id: req.body.checkbox}, function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Successfully deleted the item with the _id: " + req.body.checkbox + ".");
  //   }
  // });
  // 
  // res.redirect("/");

  Item.findByIdAndRemove(req.body.checkbox, function(err) {
    if (!err) {
      console.log("Successfully deleted the item with the _id: " + req.body.checkbox + ".");
      res.redirect("/");
    }
  });

});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
