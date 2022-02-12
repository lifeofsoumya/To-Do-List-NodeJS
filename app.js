const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const app = express();

const port = process.env.PORT || 3000; // setting up port on PORT or 3000

app.set('view engine', 'ejs'); // set the view engine to ejs

app.use(bodyParser.urlencoded({extended:true})); //parses incoming request bodies in a middleware before you handle it
app.use(express.static("public")); // use public folder to access static files like css

// let items = ["First item", "Second item"]; init array for all to do li elements 

let workItems = []; //init array for work items list


mongoose.connect("mongodb+srv://LearnDB:XMHluSqZjKSCOoaT@cluster0.fsj5n.mongodb.net/toDoList?retryWrites=true&w=majority"); //connecting to the database on mongoDB Atlas

const itemsSchema = { // creating a schema for DB model
    name: String
};

const Item = mongoose.model("Item", itemsSchema); // creating a model using previous schema, usually models are n

const item1 = new Item({ // creating a new item from the Item Model
    name: "Welcome to ToDoList"
}); 

const item2 = new Item({
    name: "Welcome to ToDoList"
}); 

const item3 = new Item({
    name: "Welcome to ToDoList"
}); 

const defaultItems = [item1, item2, item3] // creating an array with previously created items

Item.insertMany(defaultItems, (err)=>{ // insert newly created array to Item
    console.log('error in inserting')
});

app.get("/", (req, res) => {

    let today = new Date(); // get current date

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options); // returns a Date object as a string

    Item.find({}, (err, foundItems)=>{ // {} finds everything, foundItems contains everything
        
        res.render("list", {listTitle: day, newListItems: foundItems }); // use res.render to load up an ejs view file
    // it renders list.ejs file and passes the kindOfDay and newListItems variable values
    
    })

});


app.post ("/", (req, res) =>{

    let item = req.body.newItem; // accepts 'newItem' data from the client side input form and stores in item var

    if (req.body.list === "work") { // checks if the req was done from the /work route, form name=list, value=work if request is done from /work route
        workItems.push(item);  // push new received item to workItems array
        res.redirect("/work");
    } else {        
        items.push(item); // pushes new item to the items array    
        res.redirect("/"); //sends request to home page after inserting item to array
    } 
    
})




app.get("/work", (req, res) =>{ //asks for work route
    res.render("list", {listTitle: "work", newListItems: workItems});
}) 


app.listen(port, ()=>{
    console.log(`Server listening to ${port}`); // server started at port
})




