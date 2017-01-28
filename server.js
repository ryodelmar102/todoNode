var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var qs = require('querystring');
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
    if (req.url === '/todo/show'){
      todoController.show();
    } else if (req.url === '/todo/create'){
      todoController.create();
    } else if (req.url === '/todo/edit'){
      todoController.edit();
    } else if (req.url === '/todo/delete'){
      todoController.delete();
    } else if (req.url === '/account/login'){
      todoController.login();
    } else if (req.url === '/account/create'){
      todoController.accountCreate();
    } else if (req.url === '/'||req.url === '/login'||req.url === '/todo'||req.url === '/create'){
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
      console.log(contents);
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
    } else {
      // not found を返す
      res.writeHead(404,{
        'content-type': 'text/plain'
      })
      res.end('Not Found');
    };
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
  show(){
    this.connection.query('select * from todos',function(error,rows,fields){
      // error: the value returned when failed
      // rows: when successed, acquire all rows
      // fields: id, text, plan_date etc...
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
      this.connection.query('insert into todos (text,plan_date,done) values (?,?,?)',[post.text, post.plan_date, false],function(error,rows,fields){
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
      this.connection.query('select mail, password from users where mail = ?',[post.username],function(error,rows,fields){
        var username = rows[0].mail;
        var password = rows[0].password;
        if (post.password === password){
          this.res.writeHead(200,{
            'content-type':'application/json'
          })
          this.res.end(JSON.stringify({}));
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
