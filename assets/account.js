class Account {
  constructor(id, username, password, role){
    this.state = {
      id:id,
      username:username,
      password:password,
      role:role
    }
  }
  render(){
    var id = document.createElement('div');
    id.className = 'accountId';
    id.innerText = this.state.id;
    this.username = document.createElement('input');
    this.username.className = 'username';
    this.username.value = this.state.username;
    if(this.state.role === 'reference'){
      this.username.disabled = true;
    }
    this.password = document.createElement('input');
    this.password.className = 'password';
    this.password.value = this.state.password;
    if(this.state.role === 'reference'){
      this.password.disabled = true;
    }
    var accountEdit = document.createElement('div');
    accountEdit.className = 'accountEdit';
    var edit = document.createElement('input');
    edit.className = 'edit';
    edit.type = 'button';
    edit.onclick = this.onChange.bind(this);
    edit.value = 'Edit';
    accountEdit.appendChild(edit);
    var accountDelete = document.createElement('div');
    accountDelete.className = 'accountDelete';
    var deletebutton = document.createElement('input');
    deletebutton.className = 'deletebutton';
    deletebutton.type = 'button';
    deletebutton.onclick = this.onDelete.bind(this);
    deletebutton.value = 'Delete';
    accountDelete.appendChild(deletebutton);
    var component = document.createElement('div');
    component.className = 'component';
    component.appendChild(id);
    component.appendChild(this.username);
    component.appendChild(this.password);
    component.appendChild(accountEdit);
    component.appendChild(accountDelete);
    return component;
  };
  onChange(){
    this.state.username = this.username.value;
    this.state.password = this.password.value;
    var data = {
      id: this.state.id,
      username: this.state.username,
      password: this.state.password,
    };
    var xhr = new XMLHttpRequest();
    var url = baseurl+'account/edit';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           if (this.onEdited){
             this.onEdited();
           }
         }
      }
    }.bind(this)
    xhr.open('POST',url,false);
    var urlEncodedDataPairs = [];
    for (var name in data) {
    	urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedData);
  }
  onDelete(){
    var data = {
      id: this.state.id
    }
    var xhr = new XMLHttpRequest();
    var url = baseurl+'account/delete';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           if (this.onDeleted){
             this.onDeleted();
           }
         }
      }
    }.bind(this);
    xhr.open('DELETE',url,false);
    var urlEncodedDataPairs = [];
    for (var name in data) {
    	urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedData);
  }
}
