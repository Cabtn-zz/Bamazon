var mysql = require('mysql');
var prompt = require('prompt');
var prompts = require('./prompts.js');
require('console.table');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon",
});
//Upon connecting to our server we fetch the products
connection.connect(function(err,res){
    fetchProducts();
});
//Selects all of the products from the table and loops through them displaying a table
const fetchProducts = () => {
    connection.query("SELECT * FROM products", function(err, res) {
            for (var i = 0; i < res.length; i++) {
            }
        console.table(res);
        promptSelect();
    })
};
//This is asks the user to select an item then determine the quantity they want if they select a valid item_id
const promptSelect = () => {
    prompt.start();
    prompt.get(prompts.itemPrompt, function(err, result){
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
//We pass in the results from our promptselect function here and display the name of that function
const productChosen = (result) => {
    connection.query("SELECT * FROM products WHERE ?", {
        item_id: result
    },function (err, res){
        console.log(res[0].product_name);
    });
};
//Using the results from promoptSelect we subtract the answer from the stock_quantity if the value is greater than 0. There is a bug here where a user could
//an excess of stock
const selectQuantity = (x) => {
    prompt.start();
    prompt.get(prompts.quantityPrompt, function(err,result){
        connection.query("SELECT * FROM products WHERE ?", {
            item_id: x
        },function(err, res){
                if (res[0].stock_quantity > 0){
                   connection.query("UPDATE products SET ? WHERE ?", [{
                       stock_quantity: parseInt(res[0].stock_quantity) - parseInt(result.quantity)},
                       {item_id: x                       
                    }], function (err, res) {
                });
                    console.log("We have successfully fulfilled you're order");
                }
                else {
                    console.log("I'm sorry we don't have enough of that item to fulfill your order");
                    promptSelect();
                }
        })
    })
};

