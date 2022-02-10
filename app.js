const express = require('express')
const bodyParser = require('body-parser')

const app = express();

const port = process.env.PORT || 3000; // setting up port on PORT or 3000

app.set('view engine', 'ejs'); // set the view engine to ejs

app.use(bodyParser.urlencoded({extended:true})); //parses incoming request bodies in a middleware before you handle it

var items = ["First item", "Second item"]; // init array for all to do li elements 

app.get("/", (req, res) => {

    var today = new Date(); // get current date

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options); // returns a Date object as a string

    res.render("list", {kindOfDay: day, newListItems: items }); // use res.render to load up an ejs view file
    // it renders list.ejs file and passes the kindOfDay and newListItems variable values
});

app.post ("/", (req, res) =>{

    var item = req.body.newItem; // accepts 'newItem' data from the client side input form and stores in item var

    items.push(item); // pushes new item to the items array

    res.redirect("/"); //sends request to home page after inserting item to array
})

app.listen(port, ()=>{
    console.log(`Server listening to ${port}`); // server started at port
})

// basic prototype is ready