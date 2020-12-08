const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true,useUnifiedTopology:true});
app.use(body.urlencoded({extened : true}));
app.use(body.json());
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));

const listSchema = {
    name : String
};

const List = mongoose.model("List", listSchema);

const item1 = new List({
    name : "Welcome!!!"
});
const item2 = new List({
    name : "Click + to add new List items."
});
const item3 = new List({
    name : "Click <-- to delete an item."
});
const items = [item1, item2, item3];



List.find().exec(function (err, results) {
    var count = results.length
    if(count === 0){
        List.insertMany(
            items,
            function(){
                if(!err){
                    console.log("successfully added!")
                }else{
                    console.log(err);
                }
            }
        );
    }
});



app.get("/", function(req, res){

    List.find({},function(err, results){
        
        res.render("index",{heading : "Today", newList : results});
        
    });    
});

app.post("/", function(req,res){
    const add = req.body.newItem;
    const added = new List({
        name : add
    });
    
    List.insertMany(added, function(err){
        if(!err){
            res.redirect("/");
            console.log("added!!!");
        }else{
            console.log(err);
        }
    })
});

app.get("/:customListName", function(req, res){
    
});

app.post("/delete", function(req,res){
    console.log(req.body.checked);
    List.deleteOne({name : req.body.checked},function(err){
        if(!err){
            List.find().exec(function (err, results) {
                var count = results.length
                if(count === 0){
                    List.insertMany(
                        items,
                        function(err){
                            if(!err){
                                console.log("successfully added!")
                            }else{
                                console.log(err);
                            }
                        }
                    );
                }
            });
            res.redirect("/");
        }else{
            console.log(err);
        }
    })
});

app.listen(3000, function(){
    console.log("listening!!!");
});