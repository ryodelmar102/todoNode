var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
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

    } else if (req.url === '/todo/edit'){

    } else if (req.url === '/todo/delete'){

    } else if (req.url === '/'){
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
    } else if (req.url === '/application.js'){
      var fileReader = new FileReader('./assets');
      var contents = fileReader.read('application.js');
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
