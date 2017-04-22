var mysql = require('mysql');
var prompt = require('prompt');
require('console.table');

//This should be an FS can't require a CSV
// var products = require('./bamazon.csv');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
});

connection.connect(function(err,res){
    console.log("connected");
    fetchProducts();
});

const fetchProducts = () => {
    connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {
            }
        console.table(res);
        promptSelect();
    })
};

const productChosen = (result) => {
    connection.query("SELECT * FROM products WHERE ?", {
        item_id: result
    },function (err, res){
        console.log(res[0].product_name);
    });
};
//SOMETHING IS WRONG WITH THIS FUNCTION;
const selectQuantity = (x) => {
    prompt.start();
    prompt.get(quantityPrompt, function(err,result){
        if(err) {console.log("error here")}
        console.log("resss", typeof parseInt(result.quantity));
        // console.log(result.quantity);
        connection.query("SELECT * FROM products WHERE ?", {
            //FIX THIS LINE
            item_id: x
        },function(err, res){
            //PARSE INT STUFF 
            console.log("LINE 45===" + res[0].stock_quantity);
                if (res[0].stock_quantity > 0){
                    console.log("You can have");
                }
                else {
                    console.log("All out");
                }
        })
    })
};

var itemPrompt = {
        properties: {
            item_id: { 
                message: "Using the item_id, select an product you'd like",
                warning: 'Must select an ID of 1-8',
                validator: /^[0-8]*$/,
                name: "item_id",
            },
        }
};

var quantityPrompt = {
        properties: {
            quantity: {
                message: "How many would you like?",
                validator: /^[0-9]*$/,
                name: "stock",
            },
        }
}

const promptSelect = () => {
    prompt.start();
    prompt.get(itemPrompt, function(err, result){
        console.log(result.item_id);
        if (result.item_id < 9) {
            var x = result.item_id;
            productChosen(x);
            selectQuantity(x);
        }
        else {
            console.log("We don't have that item, please choose another.")
            promptSelect();
        }
    });
};

