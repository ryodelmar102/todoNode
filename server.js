var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var qs = require('querystring');
var bcrypt = require('bcrypt-nodejs');
// fs = file system ファイル操作を行うモジュール
//標準関数 require = node js に含まれる標準機能を呼び出すなど、任意のモジュールを呼び出す
// http = node が用意しているweb serverを書くためのモジュール

var connection = mysql.createConnection({
  user: 'root',
  password: 'nagisa903',
  host: 'localhost',
  database: 'ToDo_development'
});
connection.connect();

var server = http.createServer(
  function(req,res){
    var todoController = new TodoController(connection,req,res);
    console.log(req.url);
    todoController.beforeAction(function(loggedin,role){
      if (req.url === '/todo/show' && loggedin){
        todoController.show();
      } else if (req.url === '/todo/show/undone' && loggedin){
        todoController.undone();
      } else if (req.url === '/todo/create' && loggedin && (role === 'admin' ||role === 'user')){
        todoController.create();
      } else if (req.url === '/todo/edit' && loggedin && (role === 'admin' ||role === 'user')){
        todoController.edit();
      } else if (req.url === '/todo/delete' && loggedin && (role === 'admin' ||role === 'user')){
        todoController.delete();
      } else if (req.url === '/account/login' && ! loggedin){
        todoController.login();
      } else if (req.url === '/account/create' && role === 'admin'){
        todoController.accountCreate();
      } else if (req.url === '/account/show' && loggedin && (role === 'admin' ||role === 'reference')){
        todoController.accountShow();
      } else if (req.url === '/account/edit' && loggedin && role === 'admin'){
        todoController.accountEdit();
      } else if (req.url === '/account/delete' && loggedin && role === 'admin'){
        todoController.accountDelete();
      } else if (req.url === '/account/logout' && loggedin){
        todoController.accountLogout();
      } else if (req.url === '/'||req.url === '/login'||req.url === '/todo'||req.url === '/create'||req.url === '/account'){
        var fileReader = new FileReader('./assets');
        var contents = fileReader.read('index.html');
        res.writeHead(200,{
          'content-type': 'text/html'
        })
        res.write(contents);
        res.end();
      } else if (req.url === '/application.css'){
        var fileReader = new FileReader('./assets');
        var contents = fileReader.read('application.css');
        res.writeHead(200,{
          'content-type': 'text/css'
        })
        res.write(contents);
        res.end();
      } else if (req.url.match(/^\/.*\.js$/)){
        var fileReader = new FileReader('./assets');
        var contents = fileReader.read(req.url.substr(1));
        res.writeHead(200,{
          'content-type': 'text/javascript'
        })
        res.write(contents);
        res.end();
      } else if (req.url === '/auth'){
        res.writeHead(200,{
          'content-type': 'application/json'
        })
        res.end(JSON.stringify({
          loggedin: loggedin,
          role: role
        }));
      } else {
        // not found を返す
        res.writeHead(404,{
          'content-type': 'text/plain'
        })
        res.end('Not Found');
      };
    });
  }
);
server.listen(3000);
// サーバーを実体化
class TodoController {
  constructor(connection,req,res) {
    this.connection = connection;
    this.req = req;
    this.res = res;
  }
  beforeAction(callback){
    this.req.headers.cookie;
    var cookie = this.req.headers.cookie;
    var object = {};
    if(cookie){cookie.split(';').forEach(function(cookie){
      var parts = cookie.split('=');
      object[parts.shift().trim()] = decodeURI(parts.join('='));
      this.connection.query('select role, session.user_id from session inner join role on session.user_id = role.user_id where session.session_id = ?',[object['session_id']],function(error,rows,fields){
        if(error){
          throw error;
        }
        this.req.cookie = object;
        if(rows.length > 0){
          var role = rows[0].role;
          this.req.role = rows[0].role;
          this.req.user_id = rows[0].user_id;
          console.log(role)
          callback(true,role);
        } else {
          callback(false,null);
        }
      }.bind(this))
    }.bind(this))} else {
      console.log('logged out');
      callback(false,null);
    }
    console.log(object['session_id']);
  }
  show(){
    var sql = 'select * from todos';
    var params = [];
    if (this.req.role != 'admin' && this.req.role != 'reference'){
      sql+= ' where user_id = ?'
      params.push(this.req.user_id)
    }
    this.connection.query(sql,params,function(error,rows,fields){
      // error: the value returned when failed
      // rows: when successed, acquire all rows
      // fields: id, text, plan_date etc...
      if(error){
        throw error;
      }
      var tasks = rows.map(function(record){
        var task = new Task(record.id,record.text,record.plan_date,record.done);
        return task;
      });
      this.res.writeHead(200,{
        'content-type': 'application/json'
      })
      this.res.end(JSON.stringify(tasks));
    }.bind(this));
  }
  undone(){
    var sql = 'select * from todos where done=0';
    var params = [];
    if (this.req.role != 'admin' && this.req.role != 'reference'){
      sql+= ' and user_id = ?'
      params.push(this.req.user_id)
    }
    this.connection.query(sql,params,function(error,rows,fields){
      if(error){
        throw error;
      }
      console.log(rows[0].id);
      var tasks = rows.map(function(record){
        var task = new Task(record.id,record.text,record.plan_date,record.done);
        return task;
      });
      this.res.writeHead(200,{
        'content-type': 'application/json'
      })
      this.res.end(JSON.stringify(tasks));
    }.bind(this));
  };
  create(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      this.connection.query('insert into todos (text,plan_date,done,user_id) values (?,?,?,?)',[post.text, post.plan_date, false, this.req.user_id],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
  edit(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      var date = new Date(post.plan_date);
      post.plan_date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
      post.done = (post.done === 'true');
      this.connection.query('update todos set text = ?,plan_date = ?,done =? where id = ?',[post.text, post.plan_date, post.done,post.id],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
    delete(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      this.connection.query('delete from todos where id = ?',[post.id],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
  login(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      this.connection.query('select * from users where mail = ?',[post.username],function(error,rows,fields){
        if (rows.length > 0 && post.password === rows[0].password){
          var hash = bcrypt.hashSync(Math.random()+'');
          this.connection.query('insert into session (session_id,user_id) values (?,?)',[hash, rows[0].id],function(error,rows,fields){
            var date = new Date();
            var expires = date.getTime()+1800;
            this.res.writeHead(200,{
              'content-type':'application/json',
              'Set-Cookie':'session_id='+hash+';path=/;expires='+ new Date(expires).toUTCString()
//              'Set-Cookie':'session_id='+hash+';path=/;expires=Wed, 8-Feb-18 00:00:00 GMT'
            })
            this.res.end(JSON.stringify({}));
          }.bind(this));
        } else {
          console.log(error);
          this.res.writeHead(400,{
            'content-type':'application/json'
          })
          this.res.end(JSON.stringify({}));
        }
      }.bind(this))
    }.bind(this))
  }
  accountCreate(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      this.connection.query('insert into users (mail,password) values (?,?)',[post.username, post.password],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
  accountShow(){
    this.connection.query('select id,mail,password from users',function(error,rows,fields){
      if(error){
        throw error;
      }
      console.log(rows);
      var accounts = rows.map(function(record){
        var account = new Account(record.id,record.mail,record.password);
        return account;
      });
      this.res.writeHead(200,{
        'content-type': 'application/json'
      })
      this.res.end(JSON.stringify(accounts));
    }.bind(this));
  }
  accountEdit(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      this.connection.query('update users set mail = ?,password = ? where id = ?',[post.username, post.password,post.id],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
  accountDelete(){
    var body = '';
    this.req.on('data',function(data){
      body+= data;
      console.log(data);
    });
    this.req.on('end',function(){
      var post = qs.parse(body);
      console.log(post);
      this.connection.query('delete from users where id = ?',[post.id],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
    }.bind(this))
  }
  accountLogout(){
    this.connection.query('delete from session where session_id = ?',[this.req.cookie['session_id']],function(error,rows,fields){
        console.log(error);
        this.res.writeHead(200,{
          'content-type':'application/json',
          'Set-Cookie':'session_id='+';path=/;expires=Wed, 1-Feb-17 00:00:00 GMT'
        })
        this.res.end(JSON.stringify({}));
      }.bind(this));
  }
}
class FileReader {
  constructor(rootPath){
    this.rootPath = rootPath;
  }
  read(fileName){
    var contents = fs.readFileSync(this.rootPath+'/'+fileName);
    return contents;
  }
}
class Task {
  constructor(id,text,plan_date,done){
    this.id = id;
    this.text = text;
    this.plan_date = plan_date;
    this.done = done;
  }
}
class Account {
  constructor(id,username,password){
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
