class TodoInput {
  constructor() {
    this.text = null;
    this.plan_date = null;
    this.checked = null;
  }
  render(){
    this.text = document.createElement('input');
    this.text.className = 'inputText';
    this.text.type = 'text';
    this.plan_date = document.createElement('input');
    this.plan_date.className = 'plan_date';
    this.plan_date.type = 'text';
    var createbutton = document.createElement('div');
    createbutton.className = 'createbutton';
    var button = document.createElement('input');
    button.className = 'button';
    button.type = 'button';
    button.value = 'Create';
    button.onclick = this.onClicked.bind(this);
    createbutton.appendChild(button);
    var showundone = document.createElement('label');
    showundone.className = 'showundone';
    showundone.innerText = 'Show Undone';
    var undonecheck = document.createElement('div');
    undonecheck.className = 'undonecheck';
    this.checked = document.createElement('input')
    this.checked.className = 'check';
    this.checked.type = 'checkbox';
    this.checked.checked = false;
    this.checked.onchange = this.undoneCheck.bind(this);
    undonecheck.appendChild(this.checked);
    showundone.appendChild(this.checked);
    var show = document.createElement('div');
    show.className = 'show';
    var showbutton = document.createElement('input');
    showbutton.className = 'showbutton';
    showbutton.type = 'button';
    showbutton.value = 'Show';
    showbutton.onclick = this.showList.bind(this,this.checked);
    show.appendChild(showbutton);
    var create = document.createElement('div');
    create.className = 'create';
    create.appendChild(this.text);
    create.appendChild(this.plan_date);
    create.appendChild(createbutton);
    create.appendChild(show);
    create.appendChild(showundone);
    return create;
  }
  onClicked(){
    var data = {
      text: this.text.value,
      plan_date: this.plan_date.value
    }
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/todo/create';
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
           console.log(xhr.status);
           if (this.onCreate){
             this.onCreate();
           }
         }
      }
    }.bind(this);
    xhr.open('POST',url,false);
    var urlEncodedDataPairs = [];
    for (var name in data) {
    	urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    var urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(urlEncodedData);
  }
  undoneCheck(event){
    this.checked = event.target.checked;
  }
}
