class TodoDashboard {
  constructor(role) {
    this.state = {
      lists:[],
      role:role
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
    var todoShow = new TodoShow();
    todoShow.showList = this.showList.bind(this);
    var show = todoShow.render();
    var components = this.render();
    this.superComponents = superComponents;
    var todoInput = new TodoInput();
    todoInput.onCreate = this.onRefresh.bind(this);
    var create = todoInput.render();
    superComponents.appendChild(create);
    superComponents.appendChild(show);
    superComponents.appendChild(components);
    return superComponents;
  }
  render(){
    var tasks = this.state.lists.map(function(list){
      var task = new Task(list.id, list.text, list.plan_date, list.done, this.state.role);
      task.onDeleted = this.onRefresh.bind(this);
      task.onEdited = this.onRefresh.bind(this);
      return task.render();
    }.bind(this));
    console.log(tasks);
    var component = document.createElement('div');
    component.id = 'todoDashboard';
// todo input をインスタンス化して、render methodを呼んで、その結果を変数代入して、その変数をappendChild
    tasks.forEach(function(task){
      component.appendChild(task);
    });
    return component;
  }
  onRefresh(){
    var component = document.getElementById('todoDashboard');
    this.superComponents.removeChild(component);
    this.getLists();
    var components = this.render();
    this.superComponents.appendChild(components);
  }
  getUndoneLists(){
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/show/undone';
    xhr.onreadystatechange = function(){
      console.log(xhr.status)
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           var res = JSON.parse(xhr.responseText);
           this.state.lists = res;
           console.log(xhr.status);
         }
      }
    }.bind(this)
    xhr.open('GET',url,false);
    xhr.send();
  }
  showList(checkbox){
    console.log(this.superComponents.removeChild);
    var component = document.getElementById('todoDashboard');
    this.superComponents.removeChild(component);
    if (checkbox.checked){
      this.getUndoneLists();
    } else {
      this.getLists();
    }
    var components = this.render();
    this.superComponents.appendChild(components);
  }
}
