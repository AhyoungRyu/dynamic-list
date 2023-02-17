import '../style.css';

export const classNames = {
  wrapper: 'popover',
  content: 'popover-content',
};

export class PopOver {
  constructor(id) {
    this.id = id;
    this.element = document.createElement('div');
    this.element.className = classNames.wrapper;
  }

  open() {
    // 1. Setup a dimmed background
    this.createDimmer();

    // 2. Append the popover container to the bottom of the body
    document.body.appendChild(this.element);

    // 3. Create a content inside of it
    const popoverContent = document.createElement('div');
    popoverContent.classList.add(classNames.content);
    popoverContent.innerText = this.id;
    this.element.appendChild(popoverContent);

    // To disable the scroll event behind the popup
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.destroyDimmer();
    this.element.remove();

    // To get the scroll event back
    document.body.style.overflow = 'auto';
  }

  createDimmer() {
    const dimmer = document.createElement('div');
    dimmer.classList.add('dimmer');

    // To enable back-drop
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
