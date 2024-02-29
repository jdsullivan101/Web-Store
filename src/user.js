const express = require('express');
const app = express();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'gamesdata'
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to DB: ', err);
    } else {
        console.log('Connected to userDB!')
    }
}) 

app.use(express.static("home"));

app.get("/shop", function(req, res)
{
    console.log("this is from a get response")
    const ID = req.query.rec;

    
    connection.query("SELECT * FROM users WHERE USERID = ?", [ID], function(err, rows, fields)
    {
        if(err){
            console.error("Error connecting to DB:", err);
            res.status(500).send("Error retieving data from DB");
        }
        else if(rows.length === 0){
            console.error("No rows found for ID $[ID]");
        }
        else{
            console.log("data retrieved");
            console.log(rows[0].Username);
            console.log(rows[0].FirstName);
            console.log(rows[0].LastName);
            console.log(rows[0].Email);
            const prodName = rows[0].Username;
            const prodModel = rows[0].FirstName;
            res.render("test.ejs", {myMessage: prodName, model: prodModel});

        } 
        //inject data into a html 
    }
    )

}); 
//Starting Server
app.listen(3000, () =>{
    console.log('Server started on Port 3000');
});