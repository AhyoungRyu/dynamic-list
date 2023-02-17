import '../style.css';

import { Popup } from './Popup';
import { getCardId } from '../util/card';

export const classNames = {
  container: 'card',
  content: 'card-content',
};
export class Card {
  constructor(index) {
    this.index = index;

    // Define separate handlers to enable to make removeEventListener work
    // since bind(this) will create a new function
    this.moveRightHandler = this.moveRight.bind(this);
    this.moveBackHandler = this.moveBack.bind(this);
    this.clickHandler = this.handleClick.bind(this);

    this.setUpElement();
  }

  setUpElement() {
    this.currentElement = document.createElement('div');
    this.currentElement.className = classNames.container;
    this.currentElement.setAttribute('id', getCardId(this.index));

    const cardContent = document.createElement('div');
    cardContent.className = classNames.content;
    cardContent.innerText = this.index;
    this.currentElement.appendChild(cardContent);

    this.setUpEvents(this.currentElement);
  }

  setUpEvents(element) {
    this.currentElement = element;
    this.currentElement.addEventListener(
      'mouseover',
      this.moveRightHandler
    );
    this.currentElement.addEventListener(
      'mouseout',
      this.moveBackHandler
    );
    this.currentElement.addEventListener('click', this.clickHandler);
  }

  removeEvents() {
    this.currentElement.removeEventListener(
      'mouseover',
      this.moveRightHandler
    );
    this.currentElement.removeEventListener(
      'mouseout',
      this.moveBackHandler
    );
    this.currentElement.removeEventListener(
      'click',
      this.clickHandler
    );
  }

  moveWithAnimation(element, gap) {
    // Just in case there's no above or below element for the first / last one
    if (element == null) {
      return;
    }
    if (gap === 0) {
      element.style = null;
    } else {
      element.style.transform = `translateX(${gap}px)`;
      element.style.transition = 'all 0.3s ease-out';
    }
  }

  moveRight() {
    const BASE_GAP = 20;

    this.aboveElement = document.getElementById(
      getCardId(this.index - 1)
    );
    this.belowElement = document.getElementById(
      getCardId(this.index + 1)
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
    // 1. Put the card back to the origin position first
    this.moveBack();
    // 2. Disable the card's mouse & click events while the popup is opened
    this.removeEvents();
    // 3. Open a popup using the target card element
    const popup = new Popup(this.index);
    popup.open();
  }
}
