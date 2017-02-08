class AccountInput {
  constructor() {
    this.username = null;
    this.password = null;
  }
  render(){
    var logout = document.createElement('div');
    logout.className = 'logout';
    var logoutbutton = document.createElement('input');
    logoutbutton.className = 'logoutbutton';
    logoutbutton.type = 'button';
    logoutbutton.value = 'Log Out';
    logout.appendChild(logoutbutton);
    var todoInput = new TodoInput();
    logoutbutton.onclick = todoInput.onLogOut;
    var todo = document.createElement('div');
    todo.className = 'todo';
    var todobutton = document.createElement('input');
    todobutton.className = 'todobutton';
    todobutton.type = 'button';
    todobutton.value = 'To Do';
    todo.appendChild(todobutton);
    todobutton.onclick = this.todoClicked.bind(this);
    this.username = document.createElement('input');
    this.username.className = 'username';
    this.username.type = 'username';
    this.password = document.createElement('input');
    this.password.className = 'password';
    this.password.type = 'text';
    var createbutton = document.createElement('div');
    createbutton.className = 'createbutton';
    var button = document.createElement('input');
    button.className = 'button';
    button.type = 'button';
    button.value = 'Create';
    button.onclick = this.onClicked.bind(this);
    createbutton.appendChild(button);
    var create = document.createElement('div');
    create.className = 'create';
    create.appendChild(logout);
    create.appendChild(todo);
    create.appendChild(this.username);
    create.appendChild(this.password);
    create.appendChild(createbutton);
    return create;
  }
  onClicked(){
    var data = {
      username: this.username.value,
      password: this.password.value
    }
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/account/create';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           if (this.onCreate){
             this.onCreate();
           }
         }
      }
    }.bind(this);
    xhr.open('POST',url,false);
    var urlEncodedDataPairs = [];
    for (var name in data) {
    	urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedData);
  }
  todoClicked(){
    window.todoApp.changeUrl('/todo');
  }
}
