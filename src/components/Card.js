import '../style.css';

import { PopOver } from './Popover';

export class Card {
  constructor(index) {
    this.index = index;

    this.currentElement = document.createElement('div');
    this.currentElement.className = 'card';
    this.currentElement.setAttribute('id', this.getCardId(index));
    this.currentElement.innerText = index;

    this.setUpEvents();
  }

  setUpEvents() {
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

  getCardId(index) {
    return `card-${index}`;
  }

  moveWithAnimation(element, gap) {
    // Just in case there's no above or below element for the first / last one
    if (element == null) {
      return;
    }
    element.style.transform = `translateX(${gap}px)`;
    element.style.transition = 'all 0.3s ease-out';
  }

  moveRight() {
    const BASE_GAP = 20;

    this.aboveElement = document.getElementById(
      this.getCardId(this.index - 1)
    );
    this.belowElement = document.getElementById(
      this.getCardId(this.index + 1)
    );

    this.moveWithAnimation(this.aboveElement, BASE_GAP);
    this.moveWithAnimation(this.belowElement, BASE_GAP);
    this.moveWithAnimation(this.currentElement, BASE_GAP * 2);
  }

  moveBack() {
    this.moveWithAnimation(this.aboveElement, 0);
    this.moveWithAnimation(this.belowElement, 0);
    this.moveWithAnimation(this.currentElement, 0);
  }

  handleClick() {
    const popOver = new PopOver(this.index);
    popOver.open();
  }
}
