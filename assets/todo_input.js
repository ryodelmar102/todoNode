class TodoInput {
  constructor() {
    this.text = null;
    this.plan_date = null;
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
    button.value = 'create';
    button.onclick = this.onClicked.bind(this);
    createbutton.appendChild(button);
    var create = document.createElement('div');
    create.className = 'create';
    create.appendChild(this.text);
    create.appendChild(this.plan_date);
    create.appendChild(createbutton);
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
}
