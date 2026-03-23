import { createElement } from "../../shared/utils/create-element";

interface Options {
  duration?: number;
  type?: 'success' | 'error';
}

export default class NotificationMessage {
  static activeNotification: NotificationMessage;
  element: HTMLElement | null = null;
  private timerId?: number;
  private message: string;
  private duration: number;
  private type: 'success' | 'error';

  constructor(message: string, {duration = 1000, type = 'success'}: Options = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    if(NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    NotificationMessage.activeNotification = this;

    this.render();
  }

  private render() {
    const html = `
     <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;
    const elem = createElement(html);

    if (!elem) {
      throw new Error('Error rendering');
    }

    this.element = elem as HTMLElement;
  }

  show(target?: HTMLElement) {
    if (!this.element) return;
    
    const parent = target || document.body;
    parent.append(this.element);

    this.timerId = window.setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }

    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    if (NotificationMessage.activeNotification === this) {
      NotificationMessage.activeNotification = undefined!;
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
