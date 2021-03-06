//-------------------------------------------
//---------------HELPERS
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

    emit(eventName, ...arg) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(...arg));
        }
    }
}


//-------------------------------------------
//---------------TIMER
//-------------------------------------------


class Timer extends EventEmitter {
    constructor() {
        super();
    }

    timerStart() {
        let t = new Date();
        t.setHours(0, 0, 0, 0);
        let s = new Date();
        let timerID = 0;
        console.log('timerIDouter', timerID);
        let _this = this;

        return {
            start: function go() {
                t = new Date(t.getTime() + (new Date()).getTime() - s.getTime());

                _this.emit('showTimer', t);

                s = new Date();
                timerID = setTimeout(go, 100);
                console.log('timerIDinner', timerID);
            },

            stop: function () {
                clearTimeout(timerID);
                t = new Date();
                t.setHours(0, 0, 0, 0);
                s = new Date();
                console.log('stop');
            },
            

            pause: function () {
                if (s) {
                    console.log('pause1');
                    clearTimeout(timerID);
                    s = false;
                } else {
                    console.log('pause2');
                    s = new Date();

                    _this.emit('go');
                }
            }
        };
    }
}


//-------------------------------------------
//---------------MODEL
//-------------------------------------------


class Model extends EventEmitter {
    constructor(customize) {
        super();

        this.gridSize = customize.gridSize;
        this.themes = customize.themes;

        this.selectedSize = this.gridSize[0];
        this.cards = this.selectedSize * this.selectedSize;
        this.pairs = this.cards / 2;
        this.cardSize = 0;
        this.findedPairs = 0;
        this.countTries = 0;
        this.cardPair = [];
        this.appPath = './img/';
        this.listImages = ['animals-bunny-2.jpg','animals-bunny.jpg','animals-cat-2.jpg','animals-cat.jpg','animals-dog-2.jpg','animals-dog.jpg','animals-horse-2.jpg','animals-horse.jpg','architecture-london-towerbridge.jpg','architecture-moscow-redsquare.jpg','architecture-nederlanden.jpg','architecture-newyork-publiclibrary.jpg','architecture-paris-eiffeltower.jpg','cities-tokyo-night.jpg','diamond.jpg','flower.jpg','flowers-reddahlia.jpg','flowers-waterlillies.jpg','flowers-windclock.jpg','flowers.jpg','landscape-1.jpg','landscape-2.jpg','landscape-australia-outback.jpg','landscape-netherlands-deurningen.jpg','landscape-us-edgewood.jpg'];
    }


    calculateCardSize(gridWidth) {
        this.cardSize = gridWidth / this.selectedSize;

        this.cards = this.selectedSize * this.selectedSize;
        this.pairs = this.cards / 2;

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
        this.emit('message', this.findedPairs, this.pairs, this.countTries);

        return this.cardPair;
    }


    createArray() {
        const copyListImages = [...this.listImages]
            .map(image => {
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
//---------------VIEW
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

        this.message('Find all the pairs!');
    }
    

    createCard(cardSize, image) {
        const img = createElement('img', {className: 'mem-img', src: `${image}`});
        //need fix it when themes will be done
        const div = createElement('div', { className: 'mem-card theme-ligth' }, img);
        div.style.width = `${cardSize}px`;
        div.style.height = `${cardSize}px`;

        div.addEventListener('click', this.handleClick.bind(this));
    
        return div;
    }


    clearGrid() {
        const listElem = [...document.querySelectorAll('.mem-card')];
        listElem.forEach(elem => {
            elem.remove();
        });
    }


    handleClick({target}) {
        this.emit('click', target);
    }


    showCard(card) {
        card.classList.add('selected');
        //need fix it
        card.classList.remove('theme-ligth');
      
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


    message(text) {
        document.querySelector('.message').textContent = text;
    }

    //-------------------
    //---------------size field
    //-------------------

    createSelectSize(gridSize) {
        const gridSizeSelect = document.getElementById('grid-size-select');

        gridSize.forEach(elem => {
            const option = createElement('option', {value: `${elem}`}, `${elem}`);

            gridSizeSelect.appendChild(option);
        });

        gridSizeSelect.addEventListener('change', this.handleChange.bind(this));
    }


    handleChange() {
        const selectedSize = parseInt(document.getElementById('grid-size-select').value, 10);
        console.log(selectedSize);

        this.emit('selectedSize', selectedSize);
    }

    //-------------------
    //---------------themes
    //-------------------

    createSelectTheme(themes) {
        const themesSelect = document.getElementById('themes-select');

        //need fix it
        themes.forEach(elem => {
            const option = createElement('option', {value: `${elem}`}, `${elem}`);

            themesSelect.appendChild(option);
        });

        //need fix it
        themesSelect.addEventListener('change', this.handleChangeTheme.bind(this));
    }

    //need fix it
    handleChangeTheme() {
        const themes = document.getElementById('themes-select').value;
        console.log(themes);

        //need fix it
        this.emit('themes', themes);
    }

    //-------------------
    //---------------timer
    //-------------------

    showTimer(t) {
        document.querySelector('.timer-field').textContent = t.toLocaleTimeString();
    }
    
    
    timerBtn() {
        const pause = document.getElementById('timer-pause');
        pause.addEventListener('click', this.handlePause.bind(this));
    }


    removeAddEventListener() {
        const pause = document.getElementById('timer-pause');
        pause.removeEventListener('click', this.handlePause.bind(this));
    }


    handlePause({target}) {
        console.log(target);
        this.emit('pause');
    }

    //-------------------
    //---------------animation
    //-------------------
}   


//-------------------------------------------
//---------------CONTROLLER
//-------------------------------------------


class Controller {
    constructor(timer, model, view) {
        this.timer = timer;
        this.model = model;
        this.view = view;
        
        this.createGrid();
        model.on('hide', this.hideCard.bind(this));
        model.on('close', this.closeCard.bind(this));
        model.on('message', this.showMessage.bind(this));
        view.on('click', this.addClick.bind(this));
        view.on('showCard', this.showCard.bind(this));

        //-------------------
        //---------------size field
        //-------------------

        this.createSelectSize();
        view.on('selectedSize', this.selectGridSize.bind(this));

        //-------------------
        //---------------themes
        //-------------------

        this.createSelectTheme();

        //-------------------
        //---------------timer
        //-------------------

        this.timer1;
        view.on('pause', this.timerPause.bind(this));
        timer.on('go', this.timerGo.bind(this));
        timer.on('showTimer', this.showTimer.bind(this));
    }


    createGrid() {
        // this.view.removeAddEventListener();
        // if(this.timer1) {

        //     this.timer1.stop();
        //     this.timer1 =false;
        // }

        this.timerStarting();
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


    showMessage(findedPairs, cardPair, countTries) {
        this.view.message(`You found ${findedPairs} out of ${cardPair} pairs with ${countTries} tries.`);
    }

    //-------------------
    //---------------size field
    //-------------------

    createSelectSize() {
        const gridSize = this.model.gridSize;

        this.view.createSelectSize(gridSize);
    }


    selectGridSize(selectedSize) {
        this.model.selectedSize = selectedSize;
        this.view.clearGrid();

        this.createGrid();
    }

    //-------------------
    //---------------themes
    //-------------------

    createSelectTheme() {
        const themes = this.model.themes;

        this.view.createSelectTheme(themes);
    }

    //-------------------
    //---------------timer
    //-------------------

    timerStarting() {
        
        this.timer1 = this.timer.timerStart();
        this.timer1.start();
        
        this.view.timerBtn();
    }

    showTimer(t) {
        this.view.showTimer(t);
    }

    timerStop() {
        this.timer1.stop();
    }

    timerPause() {
        this.timer1.pause();
    }

    timerGo() {
        this.timer1.start();
    }
}


//-------------------------------------------
//---------------INDEX
//-------------------------------------------


const customize = {
    gridSize: [4, 6],
    themes: ['ligth', 'dark']
};

const timer = new Timer();
const model = new Model(customize);
const view = new View();
const controller = new Controller(timer,model, view);