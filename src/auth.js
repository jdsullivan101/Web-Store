const users = [];

/*
    Creating the function so that a username and password can be entered 
    to login. This is then exported to the index.js file.
*/
function createUser(username, password){
    users.push({ username, password});
    console.log(users);
}

function checkUser(username, password){
    const user = users.find(user => user.username === username)

    if(!user || user.password !== password){
        return false;
    }
    return true;

}

module.exports = {createUser, checkUser};