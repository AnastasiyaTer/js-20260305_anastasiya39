import { createElement } from "./../../shared/utils/create-element";

interface Options {
  data?: number[];
  label?: string;
  value?: number;
  link?: string;
  formatHeading?: (value: number) => string; 
}

export default class ColumnChart {
  element: HTMLElement | null = null; 
  bodyElement: HTMLElement | null = null;
  chartHeight = 50;
  private data: number[];
  private label: string;
  private value: number;
  private link?: string;
  private formatHeading?: (value: number) => string;

  constructor({
    data = [],
    label = '',
    value = 0,
    link,
    formatHeading
  }: Options = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
  
    this.render();
  }

  private render() {
    const html = `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading ? this.formatHeading(this.value) : this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody()}
          </div>
        </div>
      </div>
    `;

    const elem = createElement(html);

    if (!elem) {
      throw new Error('Error rendering');
    }
    this.element = elem as HTMLElement;
    this.bodyElement = this.element.querySelector('[data-element="body"]');

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
  }

  private getColumnBody() {
    if (!this.data.length) return '';

    const maxValue = Math.max(...this.data); 
    const scale = this.chartHeight / maxValue;

    return this.data
      .map(item => {
        const value = Math.floor(item * scale); 
        const percent = ((item / maxValue) * 100).toFixed(0) + '%'; 
        return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      })
      .join(''); 
  }

  update(newData: number[]) {
    this.data = newData;

    if (!this.element) return;

    if (this.bodyElement) {
      this.bodyElement.innerHTML = this.getColumnBody();
    }

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }
  }

  remove() {
     if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

