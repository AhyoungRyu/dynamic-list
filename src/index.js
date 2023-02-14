import './style.css';
import { delay } from './utils';

class PopOver {
  constructor(id) {
    this.id = id;
    this.element = document.createElement('div');
    this.element.className = 'popover';
  }

  open() {
    // 1. setup dimmed bg
    this.createDimmer();

    // 2. append the popup container to the bottom of the body
    document.body.appendChild(this.element);

    // 3. create a content inside of it
    const popoverContent = document.createElement('div');
    popoverContent.classList.add('popover-content');
    popoverContent.innerText = this.id;
    this.element.appendChild(popoverContent);

    document.body.style.overflow = 'hidden';
  }

  close() {
    this.destroyDimmer();

    this.element.remove();
    document.body.style.overflow = 'auto';
  }

  createDimmer() {
    const dimmer = document.createElement('div');
    dimmer.classList.add('dimmer');
    dimmer.addEventListener('click', () => {
      this.close();
    });
    document.body.appendChild(dimmer);
  }

  destroyDimmer() {
    const dimmer = document.querySelector('.dimmer');
    dimmer.remove();
  }
}

class Card {
  constructor(index) {
    this.index = index;

    this.currentElement = document.createElement('div');
    this.currentElement.className = 'card';
    this.currentElement.setAttribute('id', `card-${this.index}`);
    this.currentElement.innerText = this.index + 1;

    this.currentElement.addEventListener(
      'mouseover',
      this.moveRight.bind(this)
    );
    this.currentElement.addEventListener(
      'mouseout',
      this.moveBack.bind(this)
    );
    this.currentElement.addEventListener(
      'click',
      this.openPopOver.bind(this)
    );
  }

  initElements() {
    this.aboveElement = document.getElementById(
      `card-${this.index - 1}`
    );
    this.belowElement = document.getElementById(
      `card-${this.index + 1}`
    );
  }

  animate(element, gap) {
    if (element == null) {
      return;
    }
    element.style.transform = `translateX(${gap}px)`;
    element.style.transition = 'all 0.3s ease-out';
  }

  moveRight() {
    const BASE_GAP = 20;
    this.initElements();

    this.animate(this.aboveElement, BASE_GAP);
    this.animate(this.belowElement, BASE_GAP);
    this.animate(this.currentElement, BASE_GAP * 2);
  }

  moveBack() {
    this.initElements();

    this.animate(this.aboveElement, 0);
    this.animate(this.belowElement, 0);
    this.animate(this.currentElement, 0);
  }

  openPopOver() {
    const popOver = new PopOver(this.index + 1);
    popOver.open();
  }
}

class CardList {
  constructor() {
    this.counter = 0;
    this.container = document.getElementById('container');
    this.cards = [];
  }

  async loadItems(loadNum) {
    // Just for a delaying effect on scrolling
    const data = await delay(500, Array(loadNum).fill(''));
    data.forEach((item, index) => {
      this.cards.push(new Card(index));
      this.container.appendChild(this.cards[index].currentElement);
    });
    this.counter += 1;
  }

  bindObservation() {
    const LOAD_AT_ONCE = 100;
    // Observe loadBtn
    const options = {
      // Use the whole screen as scroll area
      root: null,
      // Do not grow or shrink the root area
      rootMargin: '0px',
      // Threshold of 1.0 will fire callback when 100% of element is visible
      threshold: 1.0,
    };
    const intersectionObserver = new IntersectionObserver(
      async (entries) => {
        const totalCards = (this.counter + 1) * LOAD_AT_ONCE;

        // If intersectionRatio is 0, the target is out of view
        // and we do not need to do anything.
        if (entries[0].intersectionRatio <= 0) return;
        if (totalCards > 100) {
          return;
        }
        await this.loadItems(totalCards);
      },
      options
    );
    // start observing
    intersectionObserver.observe(this.container);
  }
}

const cardList = new CardList();
cardList.bindObservation();
