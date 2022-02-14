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
    name: "'+' to Add & Check to Delete Tasks"
}); 

const defaultItems = [item1, item2] // creating an array with previously created items


app.get("/", (req, res) => {

    let today = new Date(); // get current date

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options); // returns a Date object as a string

    Item.find({}, (err, foundItems)=>{ // {} finds everything, foundItems contains everything
        
            if(foundItems.length==0){ //checks if the foundItems array is empty or not, if empty then save
                Item.insertMany(defaultItems, (err)=>{ // insert newly created array to Item
                    if (err){
                        console.log('error in inserting')
                    }
                    else {
                        console.log('Successfully saved')
                    }
                });
                res.redirect('/'); // redirects to home route after inserting array or skipping inserting
            } else{

                res.render("list", {listTitle: day, newListItems: foundItems }); // use res.render to load up an ejs view file
                    // it renders list.ejs file and passes the kindOfDay and newListItems variable values
                    }
    })

});


app.post ("/", (req, res) =>{

    const itemName = req.body.newItem; // accepts 'newItem' data from the client side input form and stores in itemName var

    const item = new Item({ // storing input in item schema with Item model
        name: itemName
    });

    item.save(); // saving input 

    res.redirect('/'); // redirect home route after saving
    
    // if (req.body.list === "work") { // checks if the req was done from the /work route, form name=list, value=work if request is done from /work route
    //     workItems.push(item);  // push new received item to workItems array
    //     res.redirect("/work");
    // } else {        
    //     items.push(item); // pushes new item to the items array    
    //     res.redirect("/"); //sends request to home page after inserting item to array
    // } 
})



const trashSchema = { // creating a schema for DB model
    name: String
};

const TrashItem = mongoose.model("TrashItem", trashSchema); // creating a model using previous schema, usually models are n

const tItem1 = new TrashItem({ // creating a new trashed item from the Item Model
    name: "Deleted Items will appear here"
}); 
const trashItems = [tItem1]; // init trash array



app.post("/delete", (req, res)=>{ // route for deleting a task using form onchange this.form.submit
    const checkedItemId = req.body.checkbox; // gets which checkbox was checked in the form and grabs the id

    Item.findById(checkedItemId, function (err, addToTrash) {
        if(trashItems.length==0){ //checks if the foundItems array is empty or not, if empty then save
            TrashItem.insertMany(trashItems, function(err){ 
                if (!err){
                    console.log('successfully saved to trash'); 
                    res.redirect('/')
                }
                
            })
            res.redirect('/'); // redirects to home route after inserting array or skipping inserting
        }
    })

    Item.findByIdAndRemove(checkedItemId, function(err){ // we must have a callback even if you don't want to check error, else the remove method won't work
        if (!err){
            console.log('successfully deleted'); 
            res.redirect('/')
        }
        
    })


    

})


app.get("/trash", (req, res) =>{ //asks for trash route
    res.render("trash", {newListItems: trashItems});
}) 

app.get("/done", (req, res) =>{ //asks for trash route
    res.render("done", {newListItems: trashItems});
}) 


app.listen(port, ()=>{
    console.log(`Server listening to ${port}`); // server started at port
})
