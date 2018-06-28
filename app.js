var bodyParser = require('body-parser');
var express = require('express');
var router = require('./router');
var ejs = require('ejs');
var path = require('path');
var app = express();


//静态资源
app.use(express.static('public'));

//router调用路由
app.use('/', router);

//使用ejs转html模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//服务器监听
var server = app.listen(3000, function() {

    console.log("请访问:http://127.0.0.1:3000");

})