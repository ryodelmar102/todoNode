class TodoApp {
  constructor() {
  }
  checkAuth(callback){
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/auth';
    xhr.onreadystatechange = function(){
      console.log(xhr.status)
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           var res = JSON.parse(xhr.responseText);
           callback(res.loggedin);
         }
      }
    }.bind(this)
    xhr.open('GET',url,false);
    xhr.send();
  }
  checkUrl(){
    this.checkAuth(function(loggedin){
      if (location.pathname === '/login'||location.pathname === '/'){
        if (!loggedin){
          loadScript('login.js');
          document.body.innerHTML = '';
          var login = new Login();
          var login = login.render();
          document.body.appendChild(login);
        } else {
          this.changeUrl('/todo');
        }
      }
      if (location.pathname === '/todo'){
        if (loggedin) {
          loadScript('task.js');
          loadScript('todo_input.js');
          loadScript('todo_dashboard.js');
          var todoDashboard = new TodoDashboard();
          todoDashboard.getLists();
          var components = todoDashboard.renderComponents();
          document.body.innerHTML = '';
          document.body.appendChild(components);
        } else {
          this.changeUrl('/login');
        }
      }
      if (location.pathname === '/create'){
        if (!loggedin){
          loadScript('create_account.js');
          var create = new CreateAccount();
          var components = create.render();
          document.body.innerHTML = '';
          document.body.appendChild(components);
        } else {
          this.changeUrl('/todo');
        }
      }
      if (location.pathname === '/account'){
/*        if (loggedin){
          loadScript('account.js');
          loadScript('account_input.js');
          loadScript('account_dashboard.js');
          var accountDashboard = new AccountDashboard();
          accountDashboard.getLists();
          var components = accountDashboard.renderComponents();
          document.body.innerHTML = '';
          document.body.appendChild(components);
        } else {
          this.changeUrl('/login');
        }
*/
      }
    }.bind(this));
  }
  changeUrl(path){
    history.pushState({},'',path);
    this.checkUrl();
  }
}
