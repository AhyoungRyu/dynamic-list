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
   * to load relatively small amount of elements at the first loading
   */
  bindObservation() {
    const LOAD_PER_ONCE = 30;
    const MAX_CARD_NUM = 100;
    const mod = MAX_CARD_NUM % LOAD_PER_ONCE;
    const observerOptions = {
      // Use the whole screen as scroll area
      root: null,
      // Do not grow or shrink the root area
      rootMargin: '0px',
      // Threshold of 1.0 will fire callback when 100% of element is visible
      threshold: 1,
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const totalLoaded = this.scrollCount * LOAD_PER_ONCE + mod;
        // Do not load cards more than MAX_CARD_NUM
        if (totalLoaded > MAX_CARD_NUM) {
          return;
        }

        entries.forEach(async ({ intersectionRatio }) => {
          if (intersectionRatio > 0) {
            const loadNum =
              // Calculate this to make the total number of loaded items fit to MAX_CARD_NUM
              MAX_CARD_NUM - totalLoaded < LOAD_PER_ONCE
                ? mod
                : LOAD_PER_ONCE;
            this.loadItems(loadNum);
            this.scrollCount += 1;
          }
        });
      },
      observerOptions
    );
    // start observing
    intersectionObserver.observe(this.observee);
  }
}
