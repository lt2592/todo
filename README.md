# 待办清单系统
---
### 简介
1、这是一个待办事项网站，用户创建的所有数据保存在db文件夹里的users里。  
2、这个网页的设计灵感来源于微软的[To-Do](todo.microsoft.com),所有图标素材均来自于[千库网](http://588ku.com/)。  
### 更新
6月28日:待办清单系统登陆github
### 项目展示
##### 主页显示效果图
![主页](https://github.com/lt2592/todo/blob/master/show_images/1.png)
##### 右击显示功能栏效果图
![功能1](https://github.com/lt2592/todo/blob/master/show_images/2.png)
##### 编辑待办事项效果图
![功能1.1](https://github.com/lt2592/todo/blob/master/show_images/3.png)
### 测试数据（可自己注册账号）
账户:Z09416112  
密码:qwe@1997  
### 功能实现
##### 右击功能栏
运用到[jQuery-contextify](https://www.npmjs.com/package/jquery-contextify)组件 
```
var options = {items:[
        {header: '这里是功能框的标题'},
        {text: '功能1', onclick: function() {
            alert('这是功能1')
        }},
        {text: '功能2', onclick: function() {
            alert('这是功能2')
        }}
    ]}
    $('.head').contextify(options);
```
这里的head是div图层的class名字，最后一行是将这个功能框和图层绑定。
##### 获取右击待办事项的下标
假设当前清单里有三个待办事项，分别是:first,second,third
思路：当鼠标右击待办事项‘first’的时候，由于每条待办事项加了[bootstrap](https://baike.baidu.com/item/Bootstrap/8301528?fr=aladdin)中的[list-group-item  list-group-item-action](http://www.runoob.com/bootstrap/bootstrap-list-group.html)的属性,当鼠标悬停在'first'上时将会改变样式，通过这一特性，在捕获到右击事件时循环遍历当前待办事项列表，找到改变样式的待办事项即可获取下标。  
##### 前后端数据交互
##### 前端发送ajax post清求：  
```
 $.ajax({
             type: "post",
             url: "/login_post",
             data: {},
             dataType: "json",
             success: function(data){
                      
                      }
         });
```
data为发送的json格式的数据  
success是请求成功后的回调函数
##### 前端接受后端发送的数据:  
```
res.render('index', {
    username:UserSession.username,
    lists:lists
});
 this.username = '<%= username %>'
 var lists = JSON.parse('<%- JSON.stringify(lists) %>')
```
username是字符串格式，前端调用时要加'<%= %>'  
lists时json格式,前端接收时需要用json.stringfy先将数据转化字符串,再用json.parse将字符串转化成json格式的数据  

##### 后端接收数据：
```
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
```
post是express.Router中的一个方法，req.body.listName能解析出发送过来的json数据中键为'listName'的值
##### 后端发送数据：
```
res.render('index', {
    username:UserSession.username,
    lists:lists
});
```
render第二个参数为数据对象
### 注意事项
1、右击菜单功能中的部分功能只有在浏览待办事项的时候使用,部分功能在搜索待办事项或者排序时时不能使用的。如果你在排序或者搜索时使用了这些功能，会弹出窗口提示。  
2、使用隐藏已完成事项功能时，如一个清单中所有事项都已经完成，再想显示已完成事项只有切换到其他有未完成事项的清单右击显示已完成待办事项或者再当前清单添加一个待办事项右击显示已完成待办事项  
3、用户密码未采取任何加密措施，请不要添加重要信息
### 异常情况
1、在向服务器端发送post请求时，有时会出现未响应错误，过段时间服务器才会接收请求。  

