import jest from 'jest-mock';
import { CardList, elementIds } from '../components/CardList';

describe('CardList', () => {
  describe('bindObservation', () => {
    beforeEach(() => {
      // Just mocking IntersectionObserver
      // since IntersectionObserver isn't available in test env
      const mockIntersectionObserver = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: () => null,
      });
      window.IntersectionObserver = mockIntersectionObserver;
    });

    it('should trigger the callback when the element intersects the viewport', () => {
      const cardList = new CardList();

      // create a mock observee element
      const element = document.createElement('div');
      element.setAttribute('id', elementIds.observee);

      const observer = new window.IntersectionObserver((entries) => {
        // If the callback has been triggered, the intersectionRatio should be larger than 0
        expect(entries[0].intersectionRatio).not.toBe(0);
        // should be scrolled more than once at least
        expect(cardList.scrollCount).not.toBe(0);
        expect(cardList.loadItems).toBeCalled();
      });

      // call the observe method with the mock element
      observer.observe(element);
      // trigger the callback by simulating intersection with the viewport
      element.style.height = '100vh';
    });
  });

  describe('loadItems', () => {
    it('should append the given number of Card items to the container element', () => {
      // create a mock container element
      const element = document.createElement('div');
      element.setAttribute('id', elementIds.container);
      document.body.appendChild(element);

      const cardList = new CardList();
      cardList.loadItems(5);

      expect(cardList.cards.length).toBe(5);
    });
  });
});
