var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./db');
function getLists(username){
    userInfo =  JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === username)
            return userInfo[i].lists
}