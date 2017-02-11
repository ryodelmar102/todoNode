class AccountDashboard {
  constructor(role) {
    this.state = {
      lists:[],
      role:role
    };
  }
  getLists(){
    var xhr = new XMLHttpRequest();
    var url = baseurl+'account/show';
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
    var accounts = this.state.lists.map(function(list){
      var account = new Account(list.id, list.username, list.password, this.state.role);
      account.onDeleted = this.onRefresh.bind(this);
      account.onEdited = this.onRefresh.bind(this);
      return account.render();
    }.bind(this));
    var component = document.createElement('div');
    var accountInput = new AccountInput();
    accountInput.onCreate = this.onRefresh.bind(this);
    var create = accountInput.render();
    component.appendChild(create);
// todo input をインスタンス化して、render methodを呼んで、その結果を変数代入して、その変数をappendChild
    accounts.forEach(function(account){
      component.appendChild(account);
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
