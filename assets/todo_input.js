class TodoInput {
  constructor() {
    this.text = null;
    this.plan_date = null;
  }
  render(){
    var logout = document.createElement('div');
    logout.className = 'logout';
    var logoutbutton = document.createElement('input');
    logoutbutton.className = 'logoutbutton';
    logoutbutton.type = 'button';
    logoutbutton.value = 'Log Out';
    logout.appendChild(logoutbutton);
    logoutbutton.onclick = this.onLogOut.bind(this);
    var account = document.createElement('div');
    account.className = 'account';
    var accountbutton = document.createElement('input');
    accountbutton.className = 'accountbutton';
    accountbutton.type = 'button';
    accountbutton.value = 'Account';
    account.appendChild(accountbutton);
    accountbutton.onclick = this.accountClicked.bind(this);
    this.text = document.createElement('input');
    this.text.className = 'inputText';
    this.text.type = 'text';
    this.plan_date = document.createElement('input');
    this.plan_date.className = 'plan_date';
    this.plan_date.type = 'text';
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
    create.appendChild(account);
    create.appendChild(this.text);
    create.appendChild(this.plan_date);
    create.appendChild(createbutton);
    return create;
  }
  onClicked(){
    var data = {
      text: this.text.value,
      plan_date: this.plan_date.value
    }
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/create';
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
  onLogOut(){
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/account/logout';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          window.todoApp.changeUrl('/login');
        } else if(xhr.status === 400){
        }
      }
    };
    xhr.open('POST',url,false);
    xhr.send();
  }
  accountClicked(){
    window.todoApp.changeUrl('/account');
  }
  reset(){
    this.text.value = '';
    this.plan_date.value = '';
  }
}
