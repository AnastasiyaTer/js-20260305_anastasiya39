type SortOrder = 'asc' | 'desc';

type SortableTableData = Record<string, string | number>;

interface SortableTableHeader {
  id: string;
  title: string;
  sortable?: boolean;
  sortType?: 'string' | 'number';
  template?: (value: string | number) => string;
}

export default class SortableTable {
  element: HTMLElement | null = null;
  private headers: SortableTableHeader[];
  private data: SortableTableData[];

  constructor(headersConfig: SortableTableHeader[] = [], data: SortableTableData[] = []) {
    this.headers = headersConfig;
    this.data = data;
    this.render();
  }

  private render() {
    this.element = document.createElement('div');
    this.element.classList.add('sortable-table');

    const headerHtml = this.headers.map(header => `
      <div class="sortable-table__cell"
           data-id="${header.id}"
           data-sortable="${header.sortable ? 'true' : 'false'}">
        <span>${header.title}</span>
        ${header.sortable ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>` : ''}
      </div>
    `).join('');

    const headerContainer = document.createElement('div');
    headerContainer.dataset.element = 'header';
    headerContainer.classList.add('sortable-table__header', 'sortable-table__row');
    headerContainer.innerHTML = headerHtml;

    const bodyContainer = document.createElement('div');
    bodyContainer.dataset.element = 'body';
    bodyContainer.classList.add('sortable-table__body');
    bodyContainer.innerHTML = this.getTableBody(this.data);

    this.element.append(headerContainer, bodyContainer);
  }

  private getTableBody(data: SortableTableData[]) {
    return data.map(row => `
      <a href="/products/${row['title']}" class="sortable-table__row">
        ${this.headers.map(header => {
          const value = row[header.id];
          return header.template ? header.template(value) : `<div class="sortable-table__cell">${value}</div>`;
        }).join('')}
      </a>
    `).join('');
  }

  sort(field: string, order: SortOrder = 'asc') {
    const header = this.headers.find(h => h.id === field && h.sortable);
    if (!header) return;

    const direction = order === 'asc' ? 1 : -1;
    const sortType = header.sortType || 'string';

    this.data.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (sortType === 'number') {
        return direction * ((aValue as number) - (bValue as number));
      } else {
        return direction * String(aValue).localeCompare(
          String(bValue),
          ['ru', 'en'],
          { numeric: true, caseFirst: 'upper' }
        );
      }
    });

    if (!this.element) return;
    
    this.element.querySelectorAll<HTMLElement>('.sortable-table__cell').forEach(cell => {
      if (cell.dataset.id === field) cell.dataset.order = order;
      else delete cell.dataset.order;
    });

    const body = this.element.querySelector<HTMLElement>('[data-element="body"]');
    if (body) body.innerHTML = this.getTableBody(this.data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.data = [];
    this.headers = [];
    this.element = null;
  }
}