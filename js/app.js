//-------------------------------------------
//---------------Helpers
//-------------------------------------------

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
    constructor(gridSize = 2) {
        this.gridSize = gridSize;
        this.cards = gridSize * gridSize;
        this.cardSize = 0;
    }

    calculateCardSize(gridWidth) {
        this.cardSize = gridWidth / this.gridSize;
        return this.cardSize;
    }
}


//-------------------------------------------
//---------------View
//-------------------------------------------

class View {
    constructor() {
        this.grid = document.querySelector('.grid');
        this.gridWidth = this.grid.offsetWidth;
    }

    createCard(cardSize) {
        const img = createElement('img', { className: 'mem-img', src: './gg' });
        const div = createElement('div', { className: 'mem-card theme-ligth' }, img);
        div.style.width = `${cardSize}px`;
        div.style.height = `${cardSize}px`;
        
        return div;
    }

    createGrid(cards, cardSize) {
        for (let i = 0; i < cards; i++) {
            let card = this.createCard(cardSize);
            this.grid.appendChild(card);
        }
    }
}


//-------------------------------------------
//---------------Controller
//-------------------------------------------

class Controller {
    constructor(model, view) {
        this.model = Model;
        this.view = View;

        this.createGrid();
    }

    createGrid() {
        const gridWidth = view.gridWidth;
        const cardSize = model.calculateCardSize(gridWidth);

        view.createGrid(model.cards, cardSize);
    }
}


//-------------------------------------------
//---------------Index
//-------------------------------------------

// const gridSize = [2];

const model = new Model();
console.log(model);
const view = new View();
console.log(view);
const controller = new Controller(model, view);
console.log(controller);