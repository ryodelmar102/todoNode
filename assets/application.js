function loadScript(filename){
  var xhr = new XMLHttpRequest();
  var url = filename;
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
       if(xhr.status === 200){
         var script = document.createElement('script');
//         script.src = '';
         script.innerHTML = xhr.responseText;
         console.log(xhr.responseText);
         document.head.appendChild(script);
       }
    }
  }.bind(this)
  xhr.open('GET',url,false);
  xhr.send();
}
window.onload = function(){
//  loadScript('task.js');
//  loadScript('todo_input.js');
//  loadScript('todo_dashboard.js');
  loadScript('todo_app.js');
  var todoApp = new TodoApp();
  todoApp.checkUrl();
  window.todoApp = todoApp;
//  var login = new Login
//  var components = login.render();
//  document.body.appendChild(components);
//  var todoDashboard = new TodoDashboard();
//  todoDashboard.getLists();
//  var components = todoDashboard.renderComponents();
//  document.body.appendChild(components);
}
