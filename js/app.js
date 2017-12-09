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
            this.events[eventName].forEach(fn => fn(arg));
        }
    }
}


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
        this.findedPairs = 0;
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

        this.cardPair.push(item);

        return item;
    }


    checkPair(item) {
        if (this.cardPair.length !== 2) return;

        this.countTries++;

        if (this.cardPair[0].firstElementChild.src === this.cardPair[1].firstElementChild.src) {
            this.findedPairs++;
            console.log('hide');
            this.emit('hide', this.cardPair);
            this.cardPair = [];
            console.log('cardPair', this.cardPair);
        } else {
            console.log('close');
            this.emit('close', this.cardPair);
            this.cardPair = [];
            console.log('cardPair', this.cardPair);
        }
        console.log('checkPair is done');
        return this.cardPair;
    }


    createArray() {
        const copyListImages = [...this.listImages].map(image => {
            return this.appPath + image;
        })
            .slice(0, this.pairs)
            .sort(shuffle);

        const doubleListImages = [...copyListImages.sort(shuffle), ...copyListImages.sort(shuffle)]
            .sort(shuffle);
    
      return doubleListImages;
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


    createGrid(cardSize, listImg) {
        listImg.forEach(image => {
            let card = this.createCard(cardSize, image);
            this.grid.appendChild(card);
        });
    }
    

    createCard(cardSize, image) {
        const img = createElement('img', { className: 'mem-img', src: `${image}` });
        //need fix it when themes will be done
        const div = createElement('div', { className: 'mem-card theme-ligth' }, img);
        div.style.width = `${cardSize}px`;
        div.style.height = `${cardSize}px`;

        div.addEventListener('click', this.handleClick.bind(this));
    
        return div;
    }


    handleClick({target}) {
        this.emit('click', target);
    }


    showCard(card) {
        card.classList.add('selected');
      
        this.emit('showCard', card);
    }


    closeCard(cardPair) {
        console.log('outtercardPair2', cardPair);
        setTimeout(() => {
            console.log('innerclose2');
            cardPair.forEach(card => {
                card.classList.remove('selected');
                //need fix it
                card.classList.add('theme-ligth');
            });
        }, 500);
    }


    hideCard(cardPair) {
        console.log('outercardPair3', cardPair);
        setTimeout(() => {
            console.log('innerhide');
            cardPair.forEach(card => {
                //need fix it
                card.classList.remove('theme-ligth', 'selected');
                card.classList.add('empty');
            });
        }, 500);
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

        view.on('click', this.addClick.bind(this));
        view.on('showCard', this.showCard.bind(this));

        model.on('hide', this.hideCard.bind(this));
        model.on('close', this.closeCard.bind(this));
    }


    createGrid() {
        const gridWidth = view.gridWidth;
        const cardSize = model.calculateCardSize(gridWidth);
        const listImg = model.createArray();

        this.view.createGrid(cardSize, listImg);
    }


    addClick(item) {
        const card = this.model.clickCard(item);
        console.log('card', card);
       
        this.view.showCard(card);
    }

    showCard(card) {
        const cardPair = this.model.checkPair(card);

        if (cardPair) {
            this.view.closeCard(cardPair);
        }
    }

    closeCard(cardPair) {
        this.view.closeCard(cardPair);
    }

    hideCard(cardPair) {
        this.view.hideCard(cardPair);
    }
}


//-------------------------------------------
//---------------Index
//-------------------------------------------

//future option: put getsize like array and get number from model
// const gridSize = [2];
const model = new Model();
const view = new View();
const controller = new Controller(model, view);