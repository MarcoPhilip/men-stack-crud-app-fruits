
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

// Here is where we import modules
// We begin by loading Express
const express = require('express');
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

const app = express();

// ADD Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
const Fruit = require("./models/fruit.js");


// ROUTES
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.ejs");
});

// GET localhost:3000/fruits/:fruitId/edit (EDIT)
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    res.render("fruits/edit.ejs", {
        fruit: foundFruit,
      });
  });  

// SHOW route (/fruits/:fruitID)
app.get("/fruits/:fruitId", async (req, res) => {
    //get a fruit by id
    const foundFruit = await Fruit.findById(req.params.fruitId);

    //res.render
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

// UPDATE the route
app.put("/fruits/:fruitId", async (req, res) => {
    
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });
  

// DELETE /fruit/:fruitId
app.delete("/fruits/:fruitId", async (req, res) => {
    // add a delete functionality
    await Fruit.findByIdAndDelete(req.params.fruitId);
    // redirect to the fruit list after deletion
    res.redirect("/fruits");
});
  

// POST /fruits
app.post("/fruits", async (req, res) => {

    console.log("Before", req.body)

    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    console.log("After", req.body)

    await Fruit.create(req.body);
    res.redirect("/fruits");
});

// GET /fruits
app.get("/fruits", async (req, res) => {

    //Get all the fruits from the database
    const allFruits = await Fruit.find();
    console.log(allFruits); // log the fruits

    //Render the page that shows all the fruits
    res.render("fruits/index.ejs", { fruits: allFruits });
});
  
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
