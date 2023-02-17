import '../style.css';

import { Card } from './Card';

export const elementIds = {
  container: 'container',
  observee: 'end-of-container',
};
export class CardList {
  constructor() {
    this.container = document.getElementById(elementIds.container);
    this.observee = document.getElementById(elementIds.observee);
    this.cards = [];
    this.scrollCount = 0;
  }

  /**
   *
   * @param loadNum: # of items wants to load at a time by the scroll event
   */
  loadItems(loadNum) {
    Array(loadNum)
      .fill('')
      .forEach(() => {
        const newCard = new Card(this.cards.length + 1);
        this.cards.push(newCard);
        this.container.appendChild(newCard.currentElement);
      });
  }

  /**
   * Observe an element at the bottom of the main container
   */
  bindObservation() {
    const LOAD_PER_ONCE = 20;
    const MAX_CARD_NUM = 100;
    const options = {
      // Use the whole screen as scroll area
      root: null,
      // Do not grow or shrink the root area
      rootMargin: '0px',
      // Threshold of 1.0 will fire callback when 100% of element is visible
      threshold: 1,
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        // Do not draw more than 100 cards
        if ((this.scrollCount + 1) * LOAD_PER_ONCE > MAX_CARD_NUM) {
          return;
        }

        entries.forEach(async ({ intersectionRatio }) => {
          if (intersectionRatio > 0) {
            this.loadItems(LOAD_PER_ONCE);
            this.scrollCount += 1;
          }
        });
      },
      options
    );
    // start observing
    intersectionObserver.observe(this.observee);
  }
}
