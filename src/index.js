import './style.css';
import { delay } from './utils';

class Card {
  constructor(rootIdx, subIdx) {
    this.rootIdx = rootIdx;
    this.subIdx = subIdx;

    this.currentElement = document.createElement('div');
    this.currentElement.className = 'card';

    const cardId = `${rootIdx + 1}_${subIdx + 1}`;

    this.currentElement.setAttribute('id', `card-${cardId}`);
    this.currentElement.innerHTML = `Card ${cardId}`;

    this.currentElement.addEventListener(
      'mouseover',
      this.moveRight.bind(this)
    );
    this.currentElement.addEventListener(
      'mouseout',
      this.moveBack.bind(this)
    );
  }

  initElements() {
    this.aboveElement = document.getElementById(
      `card-${this.rootIdx + 1}_${this.subIdx}`
    );
    this.belowElement = document.getElementById(
      `card-${this.rootIdx + 1}_${this.subIdx + 2}`
    );
  }

  moveRight() {
    this.initElements();

    if (this.aboveElement != null) {
      this.aboveElement.style.transform = 'translateX(20px)';
    }
    if (this.belowElement != null) {
      this.belowElement.style.transform = 'translateX(20px)';
    }
    this.currentElement.style.transform = 'translateX(40px)';
  }

  moveBack() {
    this.initElements();

    if (this.aboveElement != null) {
      this.aboveElement.style.transform = 'translateX(0)';
    }
    if (this.belowElement != null) {
      this.belowElement.style.transform = 'translateX(0)';
    }
    this.currentElement.style.transform = 'translateX(0)';
  }
}

class CardList {
  constructor() {
    this.counter = 0;
    this.container = document.getElementById('container');
    this.cards = [];
  }

  async loadItems(rootIdx, loadNum) {
    // Just for a delayed effect on scrolling
    const data = await delay(500, Array(loadNum).fill(`${rootIdx}`));
    data.forEach((item, subIdx) => {
      this.cards.push(new Card(rootIdx, subIdx));
      this.container.appendChild(this.cards[subIdx].currentElement);
    });
    this.counter += 1;
  }

  bindObservation() {
    const LOAD_AT_ONCE = 20;
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
        console.log({ totalCards, counter: this.counter });

        // If intersectionRatio is 0, the target is out of view
        // and we do not need to do anything.
        if (entries[0].intersectionRatio <= 0) return;
        if (totalCards > 100) {
          return;
        }
        await this.loadItems(this.counter, LOAD_AT_ONCE);
      },
      options
    );
    // start observing
    intersectionObserver.observe(this.container);
  }
}

const cardList = new CardList();
cardList.bindObservation();
