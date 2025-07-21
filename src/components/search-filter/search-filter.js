import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import UI components
import '../ui/index.js';

export class SearchFilter extends LitElement {
  static properties = {
    searchTerm: { type: String, state: true },
    selectedDepartment: { type: String, state: true }
  };

  static styles = css`
    :host {
      display: block;
    }

    .filter-container {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group {
      min-width: 150px;
    }

    @media (max-width: 768px) {
      .filter-container {
        flex-direction: column;
        align-items: stretch;
      }

      .search-group,
      .filter-group {
        min-width: unset;
      }
    }
  `;

  constructor() {
    super();
    this.searchTerm = '';
    this.selectedDepartment = '';
  }

  connectedCallback() {
    super.connectedCallback();
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
  }

  handleSearchChange(event) {
    this.searchTerm = event.detail.value;
    this.dispatchEvent(new CustomEvent('search-changed', {
      detail: this.searchTerm,
      bubbles: true,
      composed: true
    }));
  }

  handleFilterChange(event) {
    this.selectedDepartment = event.detail.value;
    this.dispatchEvent(new CustomEvent('filter-changed', {
      detail: this.selectedDepartment,
      bubbles: true,
      composed: true
    }));
  }

  getDepartmentOptions() {
    return [
      { value: '', label: i18nService.t('common.allDepartments') },
      { value: 'Analytics', label: 'Analytics' },
      { value: 'Engineering', label: i18nService.t('departments.engineering') },
      { value: 'Marketing', label: i18nService.t('departments.marketing') },
      { value: 'Sales', label: i18nService.t('departments.sales') },
      { value: 'HR', label: i18nService.t('departments.hr') },
      { value: 'Finance', label: i18nService.t('departments.finance') }
    ];
  }

  render() {
    return html`
      <div class="filter-container">
        <div class="search-group">
          <ui-input
            name="search"
            type="text"
            .value=${this.searchTerm}
            placeholder="${i18nService.t('common.search')}"
            @ui-input=${this.handleSearchChange}
          ></ui-input>
        </div>

        <div class="filter-group">
          <ui-select
            name="department"
            .value=${this.selectedDepartment}
            .options=${this.getDepartmentOptions()}
            @ui-change=${this.handleFilterChange}
          ></ui-select>
        </div>
      </div>
    `;
  }
}

customElements.define('search-filter', SearchFilter); 