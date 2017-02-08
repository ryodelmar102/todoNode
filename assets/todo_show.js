class TodoShow {
  constructor() {
    this.state = {
      checked: false
    }
  }
  render(){
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
    showbutton.onclick = function(){
      this.showList(this.checked);
    }.bind(this);
    show.appendChild(showbutton);
    var create = document.createElement('div');
    create.className = 'create';
    create.appendChild(show);
    create.appendChild(showundone);
    return create;
  }
  undoneCheck(event){
    this.state.checked = event.target.checked;
  }
}
