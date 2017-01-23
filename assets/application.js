//　window.onload の処理
// instanciate todo app
// call render of todo app
// appendchild render result to html body
window.onload = function(){
  var todoApp = new TodoApp();
  todoApp.getLists();
  var components = todoApp.renderComponents();
  document.body.appendChild(components);
}

// declare task class
// write constructor (id, text, plan_date, done)
// this.state.id などを宣言する
// var task = render みたいな感じ
// render each div component
// div 要素としてチェックボックスを宣言する。（インプット要素の中）
//　true かfalseかを取得する
// 三項演算子使う
// done にはtrue かfalseか入っているので、this.state.doneにつめ直す
//　削除ボタンの要素を実装する
// return task
class Task {
  constructor(id, text, plan_date, done) {
    this.id = id;
    this.text = text;
    this.plan_date = plan_date;
    this.done = done;
  }
  render(){
    var id = document.createElement('div');
    id.className = 'todoId';
    id.innerText = this.id;
    var text = document.createElement('div');
    text.className = 'todoText';
    text.innerText = this.text;
    var plan_date = document.createElement('div');
    plan_date.className = 'plan_date';
    var date = new Date(this.plan_date);
    plan_date.innerText = date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate();
    var todoDone = document.createElement('div');
    todoDone.className = 'done';
    var check = document.createElement('input');
    check.className = 'check';
    check.type = 'checkbox';
    check.checked = this.done ? true:false;
    todoDone.appendChild(check);
//    done.onchange = this.onChange();
    var todoDelete = document.createElement('input');
    todoDelete.className = 'todoDelete';
    todoDelete.type = 'button';
//    todoDelete.onclick = this.onClick();
    todoDelete.value = 'delete';
    var component = document.createElement('div');
    component.className = 'component';
    component.appendChild(id);
    component.appendChild(text);
    component.appendChild(plan_date);
    component.appendChild(todoDone);
    return component;
  };
}
//　taskクラスの中に、on checked のメソッドを定義する
// event.target
// xhr でサーバーにデータをupdate (?)する。（メソッド要確認）
// http://hakuhin.jp/js/xmlhttprequest.html#XHR_04
// state 4 で　code 200のときにxhr openしてsend
// var url にedit のurlを与える
// var urlをopen methodの第二引数として送る
//  task クラスの中に、 on deleted のメソッドを定義する
// delete もupdateと同様

// todo inputクラスを宣言する
// constructorを宣言する
// onclickを宣言する
// input 要素を宣言する
// xhr 使って
//
// onclick の中でon refreshを呼び出す

// declare todo app class
//　コンストラクタ
// react と同様に、tasks として、空の配列を渡す
// superComponentsのdiv要素をcreateElementする
//
// function getListsを宣言する
// ロジックはxhr で　一覧を取得して、　var tasks

// getlists と同列にrenderを宣言する
// var tasks に格納。render の中でmap処理で、taskインスタンスにつめ直し
// task.renderを呼び出してDOMにする
// for each で個々のtaskについて、appendchild superComponentsに
// return tasks

// render と同列にonrefreshを宣言
// inner html で　superComponents に空文字を代入
// get listsを呼び出す
class TodoApp {
  constructor() {
    this.state = {
      lists:[]
    };
  }
  getLists(){
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/show';
    xhr.onreadystatechange = function(){
      console.log(xhr.status)
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           var res = JSON.parse(xhr.responseText);
           this.state.lists = res;
           console.log(this.state);
         }
      }
    }.bind(this)
    xhr.open('GET',url,false);
    xhr.send();
  }
  renderComponents(){
    var superComponents = document.createElement('div');
    superComponents.className = 'superComponents';
    var components = this.render();
    superComponents.appendChild(components);
    return superComponents;
  }
  render(){
    var tasks = this.state.lists.map(function(list){
      var task = new Task(list.id, list.text, list.plan_date, list.done);
      return task.render();
    });
    console.log(tasks);
    var component = document.createElement('div');
    tasks.forEach(function(task){
      component.appendChild(task);
    });
    return component;
  }
}
