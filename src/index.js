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

    // 2. append the popover container to the bottom of the body
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
    const dimmers = document.querySelectorAll('.dimmer');
    dimmers.forEach((dimmer) => {
      dimmer.remove();
    });
  }
}

class Card {
  constructor(rootIndex, subIndex) {
    this.rootIndex = rootIndex;
    this.subIndex = subIndex;

    this.currentElement = document.createElement('div');
    this.currentElement.className = 'card';
    this.currentElement.setAttribute(
      'id',
      `card-${rootIndex}-${subIndex}`
    );
    this.currentElement.innerText = subIndex + 1;

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
      this.handleClick.bind(this)
    );
  }

  initElements() {
    this.aboveElement = document.getElementById(
      `card-${this.rootIndex}-${this.subIndex - 1}`
    );
    this.belowElement = document.getElementById(
      `card-${this.rootIndex}-${this.subIndex + 1}`
    );
  }

  animateCard(element, gap) {
    if (element == null) {
      return;
    }
    element.style.transform = `translateX(${gap}px)`;
    element.style.transition = 'all 0.3s ease-out';
  }

  moveRight() {
    const BASE_GAP = 20;
    this.initElements();

    this.animateCard(this.aboveElement, BASE_GAP);
    this.animateCard(this.belowElement, BASE_GAP);
    this.animateCard(this.currentElement, BASE_GAP * 2);
  }

  moveBack() {
    this.initElements();

    this.animateCard(this.aboveElement, 0);
    this.animateCard(this.belowElement, 0);
    this.animateCard(this.currentElement, 0);
  }

  handleClick() {
    const popOver = new PopOver(this.subIndex + 1);
    popOver.open();
  }
}

class CardList {
  constructor() {
    this.container = document.getElementById('container');
    this.observed = document.getElementById('end-of-document');
    this.cards = [];
    this.loopCounter = 1;
  }

  async loadItems(loadNum, loopCounter) {
    // Just for a delaying effect on scroll event
    const data = await delay(500, Array(loadNum).fill(loopCounter));

    data.forEach((item, index) => {
      const newCard = new Card(loopCounter, index);
      this.cards.push(newCard);
      this.container.appendChild(newCard.currentElement);
    });
  }

  bindObservation() {
    const LOAD_AT_ONCE = 20;
    const MAX_CARD_NUM = 100;
    // Observe loadBtn
    const options = {
      // Use the whole screen as scroll area
      root: null,
      // Do not grow or shrink the root area
      rootMargin: '0px',
      // Threshold of 1.0 will fire callback when 100% of element is visible
      threshold: 1,
    };

    const intersectionObserver = new IntersectionObserver(
      async (entries) => {
        if (this.loopCounter * LOAD_AT_ONCE > MAX_CARD_NUM) {
          return;
        }

        entries.forEach(async (entry) => {
          if (entry.intersectionRatio > 0) {
            await this.loadItems(LOAD_AT_ONCE, this.loopCounter);
            this.loopCounter += 1;
          }
        });
      },
      options
    );
    // start observing
    intersectionObserver.observe(this.observed);
  }
}

const cardList = new CardList();
cardList.bindObservation();
