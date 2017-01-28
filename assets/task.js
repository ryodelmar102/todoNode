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
    plan_date.innerText = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
    var todoDone = document.createElement('div');
    todoDone.className = 'done';
    var check = document.createElement('input');
    check.className = 'check';
    check.type = 'checkbox';
    check.checked = this.done ? true:false;
    check.onchange = this.onChange.bind(this);
    todoDone.appendChild(check);
    var todoDelete = document.createElement('div');
    todoDelete.className = 'delete';
    var button = document.createElement('input');
    button.className = 'button';
    button.type = 'button';
    button.onclick = this.onClick.bind(this);
    button.value = 'delete';
    todoDelete.appendChild(button);
    var component = document.createElement('div');
    component.className = 'component';
    component.appendChild(id);
    component.appendChild(text);
    component.appendChild(plan_date);
    component.appendChild(todoDone);
    component.appendChild(todoDelete);
    return component;
  };
  onChange(event){
    this.done = event.target.checked;
    var data = {
      id: this.id,
      text: this.text,
      plan_date: this.plan_date,
      done: this.done
    };
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/edit';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
         }
      }
    };
    xhr.open('POST',url,false);
    var urlEncodedDataPairs = [];
    for (var name in data) {
    	urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedData);
  }
  onClick(){
    var data = {
      id: this.id
    }
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/delete';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           if (this.onDelete){
             this.onDelete();
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
