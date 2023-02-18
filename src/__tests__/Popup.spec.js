import jest from 'jest-mock';
import { getCardId } from '../util/card';
import {
  Popup,
  classNames as popupClassNames,
  classNames as cardClassNames,
} from '../components/Popup';

const MOCK_INDEX = 2;

describe('Popup', () => {
  let popup = null;
  const events = {};

  beforeAll(() => {
    const cardElement = document.createElement('div');
    cardElement.setAttribute('id', getCardId(MOCK_INDEX));
    cardElement.className = cardClassNames.container;

    const cardContent = document.createElement('div');
    cardContent.className = cardClassNames.content;
    cardContent.innerText = MOCK_INDEX;

    cardElement.appendChild(cardContent);
    document.body.append(cardElement);

    popup = new Popup(MOCK_INDEX);
  });

  describe('open', () => {
    it('should switch the card element className into popup one', () => {
      const element = document.getElementById(getCardId(MOCK_INDEX));
      // Before the popup is opened, should have card's className
      expect(element.className).toBe(cardClassNames.container);

      popup.open();

      // should have popup's className once it's opened
      expect(element.className).toBe(popupClassNames.container);
    });

    it('should create a dimmer element', () => {
      popup.open();
      const dimmers = document.getElementsByClassName(
        popupClassNames.dimmer,
      );
      expect(dimmers.length).not.toBe(0);
    });
  });

  describe('dimmer', () => {
    it('should be able to drop by clicking it', () => {
      const closePopup = jest.spyOn(popup, 'close');

      popup.open();
      const dimmers = document.getElementsByClassName(
        popupClassNames.dimmer,
      );
      dimmers[0].addEventListener = jest.fn((event, callback) => {
        events[event] = callback;
      });

      popup.setupDimmerBackDrop(dimmers[0]);

      // By clicking the dimmer element,
      events.click();
      // close function should be called
      expect(closePopup).toHaveBeenCalled();
      // the dimmer element shoule be removed from the dom body
      expect(dimmers.length).toBe(0);
    });
  });

  describe('close', () => {
    it('should return the card element className so it can be return to the original position', () => {
      popup.close();

      // shouldn't be able to find the popup element
      const popupElements = document.getElementsByClassName(
        popupClassNames.container,
      );
      expect(popupElements.length).toBe(0);

      // but the card element should be
      const cardElement = document.getElementById(
        getCardId(MOCK_INDEX),
      );
      expect(cardElement).not.toBe(null);
    });
  });
});
