var LocalStorage = require('node-localstorage').LocalStorage;
var sessionStorage = require('sessionstorage');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

const UserSession = {
    username:'',
    password:''
}


localStorage = new LocalStorage('public/db');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//静态资源
router.use(express.static('public'));


router.get('/', function(req, res,next) {
    res.render('login');   
});

router.get('/register', function(req, res) {
    res.render('register'); 
})

router.get('/login', function(req, res) {
    res.render('login'); 
})

router.get('/logout', function(req, res) {
    sessionStorage.removeItem('userState');
    console.log('用户："'+UserSession.username+'"注销成功')
    res.redirect('login'); 
})

router.get('/index', function(req, res) {
    const userState = sessionStorage.getItem('userState');
    if (userState) {
        res.render('index', {username:UserSession.username});
    } else {
        res.render('login'); 
    }

})
router.post('/login_post', urlencodedParser, function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var userInfo = JSON.parse(localStorage.getItem('users'));
    var flag = -1
    if(justify()){
        for(var i=0;i<userInfo.length;i++)
            if(userInfo[i].username === username)
                flag = i
        if(flag === -1){
            console.log("没有该用户！！！")
            res.redirect('login')
        }else{
            if(userInfo[flag].password=== password){
                console.log('用户："'+username+'"登陆成功')
                UserSession.username = username
                UserSession.password = password
                sessionStorage.setItem('userState', JSON.stringify(UserSession));
                res.redirect('index');
            }else{
                console.log('密码错误')
                res.redirect('login')

            }
        } 
    }else{
        res.redirect('login')
    }
    function justify(){
        if(username==""){
            console.log('用户名不能为空');
            return false;
        }else if(password==""){
            console.log('密码不能为空');
            return false;
        }return true;
    }
    res.end();
})

//注册
router.post('/register_post', urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var lists = [{listName:'我的一天',schedule:[]},{listName:'To-Do',schedule:[]},{listName:'已解决',schedule:[]}]
    var userInfo = JSON.parse(localStorage.getItem('users'));
    var flag = -1
    if(justify()){    
        for(var i=0;i<userInfo.length;i++)
            if(userInfo[i].username === username)
                flag = i
        if(flag>0){
            console.log("该用户已被注册")
        }else{
            var user = {
                username: username,
                password: password1,
                lists:lists
            };
            userInfo.push(user);
            localStorage.setItem('users', JSON.stringify(userInfo));
            res.redirect('login')
            console.log('用户:"'+username +'"注册成功'); 
        }
    }else{
        res.redirect('register')
    }  
    function justify(){  
        if(username===""){  
            console.log('用户名不能为空');  
            return false;  
        }else if(password1===""){  
            console.log('密码不能为空');  
            return false;  
        }else if(password2===""){  
            console.log('密码不能为空');  
            return false;  
        }else if(password1!==password2){
            console.log("两次输入密码不一致")
            return false;
        }else{
            return true;
        }

    }  


})
//创建清单
router.post('/create_post', urlencodedParser, function(req, res) {
    var listName = req.body.listName;
    var userInfo = JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username)
        {
            var obj = {
                listName:listName,
                schedule:[]
            }
            userInfo[i].lists.push(obj)
            console.log('清单:"'+obj.listName+'"创建成功') 
        }
    localStorage.setItem('users', JSON.stringify(userInfo)); 
})
//创建待办事项
router.post('/sub_schedule', urlencodedParser, function(req, res) {
    var kindOfList = req.body.kindOfList
    var obj = {
        sch:req.body.sch,
        flag:false,
        priority:0
    };
    var userInfo = JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username){
            userInfo[i].lists[kindOfList].schedule.push(obj)
            console.log('清单:"'+userInfo[i].lists[kindOfList].listName+'"添加待办事项："'+obj.sch+'"成功')
        }
    localStorage.setItem('users', JSON.stringify(userInfo)); 
    
})
//删除待办事项
router.post('/delete_schedule', urlencodedParser, function(req, res) {
    var rightRightKindOfSch = req.body.rightRightKindOfSch;
    var kindOfList = req.body.kindOfList;
    var userInfo = JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username){
            console.log('清单:"'+userInfo[i].lists[kindOfList].listName+'"待办事项：第"'+rightRightKindOfSch+'"个清单删除成功')
            userInfo[i].lists[kindOfList].schedule.splice(rightRightKindOfSch,1)
        }
        localStorage.setItem('users', JSON.stringify(userInfo)); 
})
//删除清单
router.post('/delete_list', urlencodedParser, function(req, res) {
    var rightRightKindOfList = req.body.rightRightKindOfList;

    var userInfo = JSON.parse(localStorage.getItem('users'));
    if(rightRightKindOfList>=3){
        for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username){
            console.log('清单:"'+userInfo[i].lists[rightRightKindOfList].listName+'"删除成功')
            userInfo[i].lists.splice(rightRightKindOfList,1)
        }
        localStorage.setItem('users', JSON.stringify(userInfo)); 
    }
    
})
//标记清单完成
router.post('/flag_sch', urlencodedParser, function(req, res) {
    var kindOfList = req.body.kindOfList;
    var rightRightKindOfSch = req.body.rightRightKindOfSch
    var userInfo = JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username){
            userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].flag = !userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].flag
            if(userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].flag===true)
                console.log('待办事项:"'+userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].sch+'"完成')
            else
            console.log('待办事项:"'+userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].sch+'"已改为未完成')
        }
    localStorage.setItem('users', JSON.stringify(userInfo)); 
})
//改变待办事务的优先级
router.post('/changePriority', urlencodedParser, function(req, res) {
    var priority = req.body.priority;
    var kindOfList = req.body.kindOfList
    var rightRightKindOfSch = req.body.rightRightKindOfSch
    var userInfo = JSON.parse(localStorage.getItem('users'));
    for(var i=0;i<userInfo.length;i++)
        if(userInfo[i].username === UserSession.username){
            userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].priority = priority;
            console.log(userInfo[i].lists[kindOfList].schedule[rightRightKindOfSch].sch+"优先级已改为"+priority)
        }
    localStorage.setItem('users', JSON.stringify(userInfo));
})


module.exports = router;