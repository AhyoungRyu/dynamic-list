import '../style.css';

export class PopOver {
  constructor(id) {
    this.id = id;
    this.element = document.createElement('div');
    this.element.className = 'popover';
  }

  open() {
    // 1. setup dimmed bg
    this.createDimmer();

    // 2. append the popover container to the bottom of the body
    document.body.appendChild(this.element);

    // 3. create a content inside of it
    const popoverContent = document.createElement('div');
    popoverContent.classList.add('popover-content');
    popoverContent.innerText = this.id;
    this.element.appendChild(popoverContent);

    document.body.style.overflow = 'hidden';
  }

  close() {
    this.destroyDimmer();

    this.element.remove();
    document.body.style.overflow = 'auto';
  }

  createDimmer() {
    const dimmer = document.createElement('div');
    dimmer.classList.add('dimmer');
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
