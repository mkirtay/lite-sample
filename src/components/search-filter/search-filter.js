import { LitElement, html, css } from 'lit';
import { t } from '../../i18n/i18n.service.js';

class SearchFilter extends LitElement {
  static properties = {
    searchTerm: { type: String },
    selectedDepartment: { type: String },
    departments: { type: Array },
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .filter-container {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
      flex-wrap: wrap;
    }

    .search-group {
      flex: 1;
      min-width: 300px;
    }

    .filter-group {
      min-width: 200px;
    }

    .filter-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-gray-700);
      margin-bottom: var(--spacing-xs);
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--border-radius-md);
      background-color: var(--color-white);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    .search-input::placeholder {
      color: var(--color-gray-500);
    }

    .department-select {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--border-radius-md);
      background-color: var(--color-white);
      cursor: pointer;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .department-select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    .clear-filters {
      background: var(--color-gray-100);
      border: 1px solid var(--color-gray-300);
      color: var(--color-gray-700);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .clear-filters:hover {
      background: var(--color-gray-200);
      border-color: var(--color-gray-400);
    }

    .clear-filters:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .filter-container {
        flex-direction: column;
        align-items: stretch;
      }

      .search-group,
      .filter-group {
        min-width: auto;
        width: 100%;
      }

      .clear-filters {
        align-self: flex-start;
      }
    }
  `;

  constructor() {
    super();
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.departments = [];
    this.language = 'en';
  }

  get hasActiveFilters() {
    return this.searchTerm || this.selectedDepartment;
  }

  _handleSearchInput(e) {
    const searchTerm = e.target.value;
    this.dispatchEvent(new CustomEvent('search-changed', {
      detail: { searchTerm },
      bubbles: true
    }));
  }

  _handleDepartmentChange(e) {
    const department = e.target.value;
    this.dispatchEvent(new CustomEvent('department-changed', {
      detail: { department },
      bubbles: true
    }));
  }

  _handleClearFilters() {
    // Clear search input
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
    }

    // Clear department select
    const departmentSelect = this.shadowRoot.querySelector('.department-select');
    if (departmentSelect) {
      departmentSelect.value = '';
    }

    // Dispatch clear events
    this.dispatchEvent(new CustomEvent('search-changed', {
      detail: { searchTerm: '' },
      bubbles: true
    }));

    this.dispatchEvent(new CustomEvent('department-changed', {
      detail: { department: '' },
      bubbles: true
    }));
  }

  render() {
    return html`
      <div class="filter-container">
        <!-- Search Input -->
        <div class="search-group">
          <label class="filter-label" for="search">
            🔍 ${t('employeeList.search', this.language)}
          </label>
          <input
            id="search"
            type="text"
            class="search-input"
            .value="${this.searchTerm}"
            placeholder="${t('employeeList.search', this.language)}"
            @input="${this._handleSearchInput}"
          />
        </div>

        <!-- Department Filter -->
        <div class="filter-group">
          <label class="filter-label" for="department">
            🏢 ${t('table.department', this.language)}
          </label>
          <select
            id="department"
            class="department-select"
            .value="${this.selectedDepartment}"
            @change="${this._handleDepartmentChange}"
          >
            <option value="">${t('employeeList.allDepartments', this.language)}</option>
            ${this.departments.map(dept => html`
              <option value="${dept}">${dept}</option>
            `)}
          </select>
        </div>

        <!-- Clear Filters Button -->
        <button
          class="clear-filters"
          ?disabled="${!this.hasActiveFilters}"
          @click="${this._handleClearFilters}"
          title="Clear all filters"
        >
          🗑️ Clear Filters
        </button>
      </div>
    `;
  }
}

customElements.define('search-filter', SearchFilter); 