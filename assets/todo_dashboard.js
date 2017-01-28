class TodoDashboard {
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
    this.superComponents = superComponents;
    return superComponents;
  }
  render(){
    var tasks = this.state.lists.map(function(list){
      var task = new Task(list.id, list.text, list.plan_date, list.done);
      task.onDelete = this.onRefresh.bind(this);
      return task.render();
    }.bind(this));
    console.log(tasks);
    var component = document.createElement('div');
    var todoInput = new TodoInput();
    todoInput.onCreate = this.onRefresh.bind(this);
    var create = todoInput.render();
    component.appendChild(create);
// todo input をインスタンス化して、render methodを呼んで、その結果を変数代入して、その変数をappendChild
    tasks.forEach(function(task){
      component.appendChild(task);
    });
    return component;
  }
  onRefresh(){
    this.superComponents.innerHTML = '';
    this.getLists();
    var components = this.render();
    this.superComponents.appendChild(components);
  }
}
