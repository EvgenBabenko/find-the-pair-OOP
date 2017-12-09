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

function shuffle(a, b) {
    return Math.random() - 0.5;
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    emit(eventName, arg) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(arg));
        }
    }
}


// class Event {
//     constructor(sender) {
//         this.sender = sender;
//         this.listeners = [];
//     }

//     attach(listener) {
//         this.listeners.push(listener);
//     }

//     notify(args) {
//         let index;
        
//         for (index = 0; index < this.listeners.length; index += 1) {
//             this.listeners[index](this.sender, args);
//         }
//     }
// }


//-------------------------------------------
//---------------Model
//-------------------------------------------

class Model extends EventEmitter {
    //by default gridsize = 2;
    //no select grid size
    constructor(gridSize = 2) {
        super();

        this.gridSize = gridSize;
        this.cards = this.gridSize * this.gridSize;
        this.pairs = this.cards / 2;
        this.cardSize = 0;
        this.countTries = 0;
        this.cardPair = [];
        this.appPath = './img/';
        this.listImages = ['animals-bunny-2.jpg','animals-bunny.jpg','animals-cat-2.jpg','animals-cat.jpg','animals-dog-2.jpg','animals-dog.jpg','animals-horse-2.jpg','animals-horse.jpg','architecture-london-towerbridge.jpg','architecture-moscow-redsquare.jpg','architecture-nederlanden.jpg','architecture-newyork-publiclibrary.jpg','architecture-paris-eiffeltower.jpg','cities-tokyo-night.jpg','diamond.jpg','flower.jpg','flowers-reddahlia.jpg','flowers-waterlillies.jpg','flowers-windclock.jpg','flowers.jpg','landscape-1.jpg','landscape-2.jpg','landscape-australia-outback.jpg','landscape-netherlands-deurningen.jpg','landscape-us-edgewood.jpg'];
    }

    calculateCardSize(gridWidth) {
        this.cardSize = gridWidth / this.gridSize;
        return this.cardSize;
    }

    clickCard(item) {
        if (this.cardPair.length === 2) return;
        // if (item.classList.contains('selected')) return;
        // if (item.classList.contains('empty')) return;

        this.cardPair.push(item);
        this.checkPair(item);
    }

    checkPair(item) {
        // if (this.cardPair !== 2) return;
        this.countTries++;

        // if (this.cardPair[0].firstElementChild.src === this.cardPair[1].firstElementChild.src)

        
        
        // this.countClick++;

        console.log('item', item);
        console.log('paircard', this.paircard);
        return this.countTries;
    }

    createArray() {
        const copyListImages = [...this.listImages];

        const array = copyListImages.map(image => {
            return this.appPath + image;
        });

        const sliced = array
            .slice(0, this.pairs)
            .sort(shuffle);
        const doubleArr = [...sliced.sort(shuffle), ...sliced.sort(shuffle)]
            .sort(shuffle);
    
      return doubleArr;
    }
}


//-------------------------------------------
//---------------View
//-------------------------------------------

class View extends EventEmitter {
    constructor() {
        super();
        
        this.grid = document.querySelector('.grid');
        this.gridWidth = this.grid.offsetWidth;
    }

    createGrid(cards, cardSize, listImg) {
        for (let i = 0; i < listImg.length; i++) {
            let card = this.createCard(cardSize, listImg[i]);
            this.grid.appendChild(card);
        }
    }
    
    createCard(cardSize, image) {
        //need get img from model
        const img = createElement('img', { className: 'mem-img', src: `${image}` });
        const div = createElement('div', { className: 'mem-card theme-ligth' }, img);
        div.style.width = `${cardSize}px`;
        div.style.height = `${cardSize}px`;

        div.addEventListener('click', this.clickCard.bind(this));
        div.addEventListener('click', this.showCard.bind(this));
    
        return div;
    }

    //maybe countClick should be in the model?
    clickCard({target}) {
        // this.countClick++
        console.log('done', target);
        this.emit('add', {target});

        // return target;

        //need send click to model
    }


    showCard(e) {
        const target = e.target.classList.add('selected'); 
    }

    closeCard(item) {
        console.log(item);
    }

    hideCard() {
        
    }
}   


//-------------------------------------------
//---------------Controller
//-------------------------------------------

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.createGrid();
        // this.addClick();
        view.on('add', this.addClick.bind(this));
    }

    createGrid() {
        const gridWidth = view.gridWidth;
        const cardSize = model.calculateCardSize(gridWidth);
        const listImg = model.createArray();

        this.view.createGrid(this.model.cards, cardSize, listImg);
    }

    addClick(item) {
        // // debugger
        
        const pair = this.model.clickCard(item);

        this.view.closeCard(pair);
        
        console.log('ditemone', pair);
        // this.view.clickCard(item);


        // this.model.checkPair(elem);
    }
}


//-------------------------------------------
//---------------Index
//-------------------------------------------

//future option: put getsize like array and get number from model
// const gridSize = [2];
const model = new Model();
console.log(model);
const view = new View();
console.log(view);
const controller = new Controller(model, view);
console.log(controller);