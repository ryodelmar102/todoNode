class TodoApp {
  constructor() {
  }
  checkUrl(){
    if (location.pathname === '/login'||location.pathname === '/'){
      loadScript('login.js');
      document.body.innerHTML = '';
      var login = new Login();
      var login = login.render();
      document.body.appendChild(login);
    }
    if (location.pathname === '/todo'){
      loadScript('task.js');
      loadScript('todo_input.js');
      loadScript('todo_dashboard.js');
      var todoDashboard = new TodoDashboard();
      todoDashboard.getLists();
      var components = todoDashboard.renderComponents();
      document.body.innerHTML = '';
      document.body.appendChild(components);
    }
    if (location.pathname === '/create'){
      loadScript('create_account.js');
      var create = new CreateAccount();
      var components = create.render();
      document.body.innerHTML = '';
      document.body.appendChild(components);
    }
  }
  changeUrl(path){
    history.pushState({},'',path);
    this.checkUrl();
  }
}
