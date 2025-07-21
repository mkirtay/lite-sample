import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

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
      align-items: center;
      flex-wrap: wrap;
    }

    .search-group {
      flex: 1;
      min-width: 200px;
    }

    .filter-group {
      min-width: 150px;
    }

    .search-input,
    .filter-select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: white;
      color: #495057;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .search-input::placeholder {
      color: #6c757d;
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
    
    // Subscribe to language changes
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Unsubscribe from language changes
    i18nService.unsubscribe(this);
  }

  handleSearchChange(e) {
    this.searchTerm = e.target.value;
    this.dispatchEvent(new CustomEvent('search-changed', {
      detail: { searchTerm: this.searchTerm },
      bubbles: true,
      composed: true
    }));
  }

  handleFilterChange(e) {
    this.selectedDepartment = e.target.value;
    this.dispatchEvent(new CustomEvent('filter-changed', {
      detail: { department: this.selectedDepartment },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="filter-container">
        <div class="search-group">
          <input
            type="text"
            class="search-input"
            .value=${this.searchTerm}
            @input=${this.handleSearchChange}
            placeholder="${i18nService.t('common.search')}"
          />
        </div>

        <div class="filter-group">
          <select
            class="filter-select"
            .value=${this.selectedDepartment}
            @change=${this.handleFilterChange}
          >
            <option value="">${i18nService.t('common.allDepartments')}</option>
            <option value="Analytics">Analytics</option>
            <option value="Engineering">${i18nService.t('departments.engineering')}</option>
            <option value="Marketing">${i18nService.t('departments.marketing')}</option>
            <option value="Sales">${i18nService.t('departments.sales')}</option>
            <option value="HR">${i18nService.t('departments.hr')}</option>
            <option value="Finance">${i18nService.t('departments.finance')}</option>
          </select>
        </div>
      </div>
    `;
  }
}

customElements.define('search-filter', SearchFilter); 