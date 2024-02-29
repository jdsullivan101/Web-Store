const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const auth = require('./auth.js');
auth.createUser("user", "pass");

//Connecting to the SQL database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'G00425758'
});


console.log(auth.checkUser("user", "pass"));

//Connecting to the SQL database with error generating messages for user
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to games DB: ', err);
    } else {
        console.log('Connected to gamesDB!')
    }
}); 

//Upon starting the node application the user is redirected to the about.html page
app.use(express.static("home",{index:"about.html"}));


//Method to generate the home html page
app.get("/home", function(req, res){
    res.render("home.ejs")
});

//Get method that will return the shop ejs view
app.get("/shop", function(req, res)
{
    console.log("this is from a get response")
    const ID = req.query.rec;

    /*
        Executing an SQL query to retrieve information from the 
    */
    connection.query("SELECT * FROM gamesdatabase WHERE ID = ?", [ID], function(err, rows, fields)
    {
        //Error code generators for the user to investigate
        if(err){
            console.error("Error connecting to DB:", err);
            res.status(500).send("Error retrieving data from DB");
        }
        else if(rows.length === 0){
            console.error("No rows found for ID $[ID]");
            res.status(404).send("No product found for $[ID]")
        }
        /*Rendering the shop page for the specific product that the user has selected.
            It will be displayed in an ejs file with html code.
        */
        else{
            console.log("data retrieved");
            console.log(rows[0].Product);
            console.log(rows[0].Console);
            console.log(rows[0].Price);
            console.log(rows[0].Image); 
            //Displaying the information in the shop template
            const prodName = rows[0].Product;
            const prodModel = rows[0].Console;
            const image = rows[0].Image;
            const price = rows[0].Price;
            res.render("shop.ejs", {selectedProd: prodName, model: prodModel, myImage: image, myPrice: price});

        } 
    });

}); 

//Get method for the login page to continue 
app.get("/login", function(req, res){
    res.render("login.ejs")
}); 

/*
    The below code is usded to ensure that a user can browse the shope without signing in.
    Upon clicking checkout on the home.ejs file the user will be redirected to verify or login 
    their username and password. Until this has been verified, the checkout page will not be generated
    as these pages are kept behind the post method("/verify").
*/
app.post("/verify", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const authenticated = auth.checkUser(username, password);

    if(authenticated){
        console.log("authentication was successful")
        res.render("checkout.ejs");
    } else{
        //generates a failed login page for the user
        res.render("failed.ejs");
        console.log("Authentication was not successful")
    }

    app.post("/final", function(req, res){
        res.render("confirmation.ejs")
    });

});

//Starting Server
app.listen(3000, () =>{
    console.log('Server started on Port 3000');
});