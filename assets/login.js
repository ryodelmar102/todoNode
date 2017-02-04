class Login {
  constructor() {
    this.username = null;
    this.password = null;
  }
  render(){
    this.username = document.createElement('input');
    this.username.className = 'username';
    this.username.type = 'text';
    this.password = document.createElement('input');
    this.password.className = 'password';
    this.password.type = 'password';
    var loginbutton = document.createElement('div');
    loginbutton.className = 'loginbutton';
    var button = document.createElement('input');
    button.className = 'button';
    button.type = 'button';
    button.value = 'Log In';
    button.onclick = this.onClicked.bind(this);
    loginbutton.appendChild(button);
    var createaccount = document.createElement('div');
    createaccount.className = 'createaccount';
    var createbutton = document.createElement('input');
    createbutton.className = 'createbutton';
    createbutton.type = 'button';
    createbutton.value = 'Create Account';
    createbutton.onclick = this.onCreate.bind(this);
    createaccount.appendChild(createbutton);
    var login = document.createElement('div');
    login.className = 'login';
    login.appendChild(this.username);
    login.appendChild(this.password);
    login.appendChild(loginbutton);
    login.appendChild(createaccount);
    return login;
  }
  onClicked(){
    try{
    var data = {
      username: this.username.value,
      password: this.password.value
    }
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/account/login';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           window.todoApp.changeUrl('/todo');
         } else if(xhr.status === 400){
           console.log(xhr.status);
           this.username.value = '';
           this.password.value = '';           
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
  } catch (e){
    this.username.value = '';
    this.password.value = '';
  }
  }
  onCreate(){
    window.todoApp.changeUrl('/create');
  }
}
