import jest from 'jest-mock';
import { Card, classNames } from '../components/Card';
import { getCardId } from '../util/card';

const MOCK_INDEX = 2;

describe('Card', () => {
  let card = null;
  let events = {};

  beforeAll(() => {
    card = new Card(MOCK_INDEX);

    // Create triple mock card elements
    const aboveElement = document.createElement('div');
    aboveElement.setAttribute('id', getCardId(card.index - 1));

    const currentElement = document.createElement('div');
    currentElement.setAttribute('id', getCardId(card.index));
    const cardContent = document.createElement('div');
    cardContent.className = classNames.content;
    cardContent.innerText = MOCK_INDEX;
    currentElement.appendChild(cardContent);

    const belowElement = document.createElement('div');
    belowElement.setAttribute('id', getCardId(card.index + 1));

    document.body.append(aboveElement, currentElement, belowElement);

    card.currentElement.addEventListener = jest.fn(
      (event, callback) => {
        events[event] = callback;
      }
    );
  });

  describe('move handlers', () => {
    it('should be able to find a target element which has a certain card id', () => {
      expect(card.currentElement.id).toBe(`card-${MOCK_INDEX}`);
    });

    it('should call moveRight by mouseover event', () => {
      const moveRight = jest.spyOn(card, 'moveRightHandler');

      card.setUpEvents(card.currentElement);
      events.mouseover();

      expect(moveRight).toHaveBeenCalled();

      // Also, able to find its above & below elements
      expect(card.aboveElement.id).toBe(`card-${MOCK_INDEX - 1}`);
      expect(card.belowElement.id).toBe(`card-${MOCK_INDEX + 1}`);
    });

    it('should call moveBack by moveBack event', () => {
      const moveBack = jest.spyOn(card, 'moveBackHandler');

      card.setUpEvents(card.currentElement);
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
      const handleClick = jest.spyOn(card, 'clickHandler');

      card.setUpEvents(card.currentElement);
      events.click();

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
