import '../style.css';
import { getCardId } from '../util/card';
import { classNames as cardClassNames, Card } from './Card';

export const classNames = {
  container: 'popup',
  content: 'popup-content',
  dimmer: 'dimmer',
};

export class Popup {
  constructor(id) {
    this.id = id;
  }

  setUpElement() {
    // 1. Setup a popup element by searching the target card element \w its id
    this.element = document.getElementById(getCardId(this.id));
    // 2. Switch the popup <-> card element's className
    this.element.className = classNames.container;
    this.contentElement = this.element.childNodes[0];
    this.contentElement.className = classNames.content;
  }

  open() {
    this.setUpElement();
    this.createDimmer();
    // Disable the body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    // 1. Bring the card className back
    this.element.className = cardClassNames.container;
    this.contentElement.className = cardClassNames.content;
    // 2. Close dimmer
    this.destroyDimmer();
    // 3. Enable the body scroll again
    document.body.style.overflow = 'auto';
    // 4. Bring the card events back too
    const card = new Card(this.id);
    card.setUpEvents(this.element);
  }

  createDimmer() {
    const dimmer = document.createElement('div');
    dimmer.className = classNames.dimmer;
    // Put the dimmer element at the bottom of the body
    document.body.appendChild(dimmer);
    // Enable back-drop
    this.setupDimmerBackDrop(dimmer);
  }

  setupDimmerBackDrop(dimmer) {
    dimmer.addEventListener('click', () => {
      this.close();
    });
  }

  destroyDimmer() {
    const dimmers = document.querySelectorAll(
      `.${classNames.dimmer}`
    );
    dimmers.forEach((dimmer) => {
      dimmer.remove();
    });
  }
}
