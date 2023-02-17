import jest from 'jest-mock';
import { Card } from '../components/Card';
import { PopOver } from '../components/Popover';

const MOCK_INDEX = 2;

describe('Card', () => {
  describe('move handlers', () => {
    let card = null;
    let events = {};

    beforeAll(() => {
      card = new Card(MOCK_INDEX);

      // create triple mock card elements
      const aboveElement = document.createElement('div');
      aboveElement.setAttribute('id', card.getCardId(card.index - 1));

      const currentElement = document.createElement('div');
      currentElement.setAttribute('id', card.getCardId(card.index));

      const belowElement = document.createElement('div');
      belowElement.setAttribute('id', card.getCardId(card.index + 1));

      document.body.append(
        aboveElement,
        currentElement,
        belowElement
      );

      card.currentElement.addEventListener = jest.fn(
        (event, callback) => {
          events[event] = callback;
        }
      );
    });

    it('should be able to find a target element which has a certain card id', () => {
      expect(card.currentElement.id).toBe(`card-${MOCK_INDEX}`);
    });

    it('should call moveRight by mouseover event and able to find above & below elements', () => {
      const moveRight = jest.spyOn(card, 'moveRight');

      card.setUpEvents();
      events.mouseover();

      expect(moveRight).toHaveBeenCalled();

      expect(card.aboveElement.id).toBe(`card-${MOCK_INDEX - 1}`);
      expect(card.belowElement.id).toBe(`card-${MOCK_INDEX + 1}`);
    });

    it('should call moveBack by moveBack event', () => {
      const moveBack = jest.spyOn(card, 'moveBack');

      card.setUpEvents();
      events.mouseout();

      expect(moveBack).toHaveBeenCalled();
    });

    it('should move the element to the right by certain pixels with an animation', () => {
      const element = {
        style: {
          transform: '',
          transition: '',
        },
      };
      card.moveWithAnimation(element, 40);

      expect(element.style.transform).toBe('translateX(40px)');
      expect(element.style.transition).toBe('all 0.3s ease-out');
    });
  });

  describe('handleClick', () => {
    it('should be called by click event', async () => {
      const card = new Card(MOCK_INDEX);
      const handleClick = jest.spyOn(card, 'handleClick');

      const events = {};
      card.currentElement.addEventListener = jest.fn(
        (event, callback) => {
          events[event] = callback;
        }
      );
      card.setUpEvents();
      events.click();

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
