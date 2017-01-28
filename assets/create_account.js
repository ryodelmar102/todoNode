class CreateAccount {
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
           window.todoApp.changeUrl('/login');
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
}
