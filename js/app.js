function createElement(tag, props, ...children) {
    const element = document.createElement(tag);
  
    Object.keys(props).forEach(key => element[key] = props[key]);
  
    children.forEach(child => {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
  
      element.appendChild(child);
    });
  
    return element;
  }



//-------------------------------------------
//---------------Model
//-------------------------------------------


class Model {
    constructor(items = []) {
        
        this.items = items;
        this.totalCards = items.map(item => {
            return item * item;
        });
        this.selectedSize = items[0];
    }

    getItems(id) {
        return this.items.find(item => item.id === id);
    }
}


//-------------------------------------------
//---------------View
//-------------------------------------------


class View {
    constructor() {
        
        this.grid = document.getElementById('grid');
        this.size = document.getElementById('grid-size');
    }

    createSelectSize(item) {
        const option = createElement('option', { value: item }, `${item}`);
    
        return option;
    }

    createGrid(item) {
        const img = createElement('img', { className: 'mem-img', src: './gg' });
        const div = createElement('div', { className: 'mem-card' }, img);
        
        return div;
    }

    // show(items) {
    //     for (let i = 0; i < items; i++) {
    //         let listItem = this.createSelectSize();
    //         this.grid.appendChild(listItem);
    //     }

    //     // items.forEach(item => {
    //     //     const listItem = this.createSelectSize(item);
      
    //     //     this.grid.appendChild(listItem);
    //     // });
    // }

    show(items) {
        items.forEach(item => {
            const listItem = this.createSelectSize(item);
      
            this.size.appendChild(listItem);
        });
    }


}

//-------------------------------------------
//---------------Controller
//-------------------------------------------


class Controller {
    constructor(model, view) {
        this.model = Model;
        this.view = View;

        
        // need fix it
        view.show(model.items);
    }

    
}




//-------------------------------------------
//---------------Index
//-------------------------------------------


const gridSize = [2, 4, 6];

const model = new Model(gridSize);
console.log(model);
const view = new View();
const controller = new Controller(model, view);