class Task {
  constructor(id, text, plan_date, done, role){
    this.state = {
      id:id,
      text:text,
      plan_date:plan_date,
      done:done,
      role:role
    }
  }
  render(){
    var id = document.createElement('div');
    id.className = 'todoId';
    id.innerText = this.state.id;
    this.text = document.createElement('input');
    this.text.className = 'todoText';
    this.text.value = this.state.text;
    if(this.state.role === 'reference'){
      this.text.disabled = true;
    }
    this.plan_date = document.createElement('input');
    this.plan_date.className = 'plan_date';
    if(this.state.role === 'reference'){
      this.plan_date.disabled = true;
    }
    var date = new Date(this.state.plan_date);
    this.plan_date.value = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
    var todoDone = document.createElement('div');
    todoDone.className = 'done';
    this.check = document.createElement('input');
    this.check.className = 'check';
    this.check.type = 'checkbox';
    this.check.checked = this.state.done ? true:false;
    this.check.onchange = this.onChange.bind(this);
    if(this.state.role === 'reference'){
      this.check.disabled = true;
    }
    todoDone.appendChild(this.check);
    var todoEdit = document.createElement('div');
    todoEdit.className = 'todoEdit';
    var edit = document.createElement('input');
    edit.className = 'edit';
    edit.type = 'button';
    edit.onclick = this.onChange.bind(this);
    edit.value = 'Edit';
    if(this.state.role === 'reference'){
      edit.disabled = true;
    }
    todoEdit.appendChild(edit);
    var todoDelete = document.createElement('div');
    todoDelete.className = 'todoDelete';
    var deletebutton = document.createElement('input');
    deletebutton.className = 'deletebutton';
    deletebutton.type = 'button';
    deletebutton.onclick = this.onDelete.bind(this);
    deletebutton.value = 'Delete';
    if(this.state.role === 'reference'){
      deletebutton.disabled = true;
    }
    todoDelete.appendChild(deletebutton);
    var component = document.createElement('div');
    component.className = 'component';
    component.appendChild(id);
    component.appendChild(this.text);
    component.appendChild(this.plan_date);
    component.appendChild(todoDone);
    component.appendChild(todoEdit);
    component.appendChild(todoDelete);
    return component;
  };
  onChange(event){
    this.state.done = this.check.checked;
    this.state.text = this.text.value;
    this.state.plan_date = this.plan_date.value;
    var data = {
      id: this.state.id,
      text: this.state.text,
      plan_date: this.state.plan_date,
      done: this.state.done
    };
    var xhr = new XMLHttpRequest();
    var url = baseurl+'todo/edit';
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
    var url = baseurl+'todo/delete';
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
