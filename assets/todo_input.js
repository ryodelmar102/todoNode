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
    var showundone = document.createElement('div');
    showundone.className = 'showundone';
    var undonebutton = document.createElement('input');
    undonebutton.className = 'undonebutton';
    undonebutton.type = 'button';
    undonebutton.value = 'Show Undone';
    undonebutton.onclick = this.unDone.bind(this,this.checked);
    showundone.appendChild(undonebutton);
    var showall = document.createElement('div');
    showall.className = 'showall';
    var allbutton = document.createElement('input');
    allbutton.className = 'allbutton';
    allbutton.type = 'button';
    allbutton.value = 'Show All';
    allbutton.onclick = this.showAll.bind(this);
    showall.appendChild(allbutton);
    var undonecheck = document.createElement('div');
    undonecheck.className = 'undonecheck';
    this.checked = document.createElement('input')
    this.checked.className = 'check';
    this.checked.type = 'checkbox';
    this.checked.value = 'Show Undone';
    this.checked.checked = this.checked ? true:false;
    this.checked.onchange = this.undoneCheck.bind(this);
    undonecheck.appendChild(this.checked);
    var create = document.createElement('div');
    create.className = 'create';
    create.appendChild(this.text);
    create.appendChild(this.plan_date);
    create.appendChild(createbutton);
    create.appendChild(showundone);
    create.appendChild(showall);
    create.appendChild(undonecheck);
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
    return this.checked;
  }.bind(this)
}
