class Task {
  constructor(id, text, plan_date, done){
    this.state = {
      id:id,
      text:text,
      plan_date:plan_date,
      done:done
    }
  }
  render(){
    var id = document.createElement('div');
    id.className = 'todoId';
    id.innerText = this.state.id;
    this.text = document.createElement('input');
    this.text.className = 'todoText';
    this.text.value = this.state.text;
    this.plan_date = document.createElement('input');
    this.plan_date.className = 'plan_date';
    var date = new Date(this.state.plan_date);
    this.plan_date.value = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
    var todoDone = document.createElement('div');
    todoDone.className = 'done';
    var check = document.createElement('input');
    check.className = 'check';
    check.type = 'checkbox';
    check.checked = this.state.done ? true:false;
    check.onchange = this.onChange.bind(this);
    todoDone.appendChild(check);
    var todoEdit = document.createElement('div');
    todoEdit.className = 'todoEdit';
    var edit = document.createElement('input');
    edit.className = 'edit';
    edit.type = 'button';
    edit.onclick = this.onChange.bind(this);
    edit.value = 'Edit';
    todoEdit.appendChild(edit);
    var todoDelete = document.createElement('div');
    todoDelete.className = 'todoDelete';
    var deletebutton = document.createElement('input');
    deletebutton.className = 'deletebutton';
    deletebutton.type = 'button';
    deletebutton.onclick = this.onDelete.bind(this);
    deletebutton.value = 'Delete';
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
    this.state.done = event.target.checked;
    this.state.text = this.text.value;
    this.state.plan_date = this.plan_date.value;
    var data = {
      id: this.state.id,
      text: this.state.text,
      plan_date: this.state.plan_date,
      done: this.state.done
    };
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/edit';
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
    var url = 'http://localhost:3000/todo/delete';
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
