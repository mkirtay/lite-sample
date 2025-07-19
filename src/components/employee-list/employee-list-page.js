import { LitElement, html, css } from 'lit';
import { t } from '../../i18n/i18n.service.js';
import { DEPARTMENTS, VIEW_MODES, APP_CONSTANTS } from '../../utils/constants.js';
import { debounce } from '../../utils/helpers.js';

// Import child components
import '../employee-table/employee-table.js';
import '../employee-cards/employee-cards.js';
import '../search-filter/search-filter.js';
import '../pagination/pagination.js';

// Sample data
const SAMPLE_EMPLOYEES = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    dateOfEmployment: '2022-01-15',
    dateOfBirth: '1990-05-10',
    phone: '+90 532 123 4567',
    email: 'ahmet.yilmaz@company.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    dateOfEmployment: '2021-06-10',
    dateOfBirth: '1988-12-03',
    phone: '+90 533 234 5678',
    email: 'ayse.kaya@company.com',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Demir',
    dateOfEmployment: '2020-03-20',
    dateOfBirth: '1985-08-15',
    phone: '+90 534 345 6789',
    email: 'mehmet.demir@company.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: '4',
    firstName: 'Fatma',
    lastName: 'Öztürk',
    dateOfEmployment: '2021-09-05',
    dateOfBirth: '1992-02-28',
    phone: '+90 535 456 7890',
    email: 'fatma.ozturk@company.com',
    department: 'Analytics',
    position: 'Junior'
  }
];

class EmployeeListPage extends LitElement {
  static properties = {
    employees: { type: Array },
    searchTerm: { type: String },
    selectedDepartment: { type: String },
    currentPage: { type: Number },
    viewMode: { type: String },
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .page-title {
      margin: 0;
      color: var(--color-gray-800);
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .employee-count {
      font-size: var(--font-size-sm);
      color: var(--color-gray-600);
      background: var(--color-gray-100);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--border-radius-md);
    }

    .add-employee-btn {
      background: var(--color-primary);
      color: var(--color-white);
      border: none;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: background-color var(--transition-fast);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .add-employee-btn:hover {
      background: var(--color-primary-dark);
    }

    .view-toggle {
      display: flex;
      background: var(--color-gray-100);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-xs);
      gap: var(--spacing-xs);
    }

    .view-btn {
      background: transparent;
      border: none;
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .view-btn.active {
      background: var(--color-white);
      box-shadow: var(--shadow-sm);
      color: var(--color-primary);
    }

    .content-section {
      background: var(--color-white);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .filters-section {
      padding: var(--spacing-lg);
      background: var(--color-gray-50);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .employees-container {
      min-height: 400px;
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4xl);
      text-align: center;
      color: var(--color-gray-500);
    }

    .no-results-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-lg);
    }

    .no-results-text {
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-sm);
    }

    .no-results-subtext {
      font-size: var(--font-size-sm);
      color: var(--color-gray-400);
    }

    .pagination-section {
      padding: var(--spacing-lg);
      background: var(--color-gray-50);
      border-top: 1px solid var(--color-gray-200);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-lg);
        align-items: stretch;
      }

      .header-actions {
        justify-content: space-between;
      }

      .view-toggle {
        order: -1;
      }
    }
  `;

  constructor() {
    super();
    this.employees = SAMPLE_EMPLOYEES;
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.currentPage = 1;
    this.viewMode = VIEW_MODES.TABLE;
    this.language = document.documentElement.lang || 'en';

    // Debounced search handler
    this._debouncedSearch = debounce((searchTerm) => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
    }, 300);
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Employee List Page connected');
  }

  // Computed properties
  get filteredEmployees() {
    return this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || employee.department === this.selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }

  get paginatedEmployees() {
    const filtered = this.filteredEmployees;
    const itemsPerPage = APP_CONSTANTS.ITEMS_PER_PAGE;
    const start = (this.currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return filtered.slice(start, end);
  }

  get totalPages() {
    const itemsPerPage = APP_CONSTANTS.ITEMS_PER_PAGE;
    return Math.ceil(this.filteredEmployees.length / itemsPerPage);
  }

  // Event handlers
  _handleSearch(e) {
    this._debouncedSearch(e.detail.searchTerm);
  }

  _handleDepartmentFilter(e) {
    this.selectedDepartment = e.detail.department;
    this.currentPage = 1;
  }

  _handleViewModeChange(viewMode) {
    this.viewMode = viewMode;
  }

  _handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  _handleAddEmployee() {
    // Navigate to add employee page
    import('../../router/router.js').then(({ AppRouter }) => {
      const router = new AppRouter();
      router.navigate('/employees/add');
    });
  }

  render() {
    const filteredEmployees = this.filteredEmployees;
    const paginatedEmployees = this.paginatedEmployees;
    const totalPages = this.totalPages;

    return html`
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">${t('employeeList.title', this.language)}</h1>
          <div class="employee-count">
            ${filteredEmployees.length} ${t('employeeList.totalEmployees', this.language)}
          </div>
        </div>

        <div class="header-actions">
          <!-- View Mode Toggle -->
          <div class="view-toggle">
            <button 
              class="view-btn ${this.viewMode === VIEW_MODES.TABLE ? 'active' : ''}"
              @click="${() => this._handleViewModeChange(VIEW_MODES.TABLE)}"
              title="${t('employeeList.viewTable', this.language)}">
              📋 ${t('employeeList.viewTable', this.language)}
            </button>
            <button 
              class="view-btn ${this.viewMode === VIEW_MODES.CARDS ? 'active' : ''}"
              @click="${() => this._handleViewModeChange(VIEW_MODES.CARDS)}"
              title="${t('employeeList.viewCards', this.language)}">
              🎴 ${t('employeeList.viewCards', this.language)}
            </button>
          </div>

          <!-- Add Employee Button -->
          <button 
            class="add-employee-btn"
            @click="${this._handleAddEmployee}">
            ➕ ${t('nav.addNew', this.language)}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-section">
        <!-- Search and Filters -->
        <div class="filters-section">
          <search-filter 
            .searchTerm="${this.searchTerm}"
            .selectedDepartment="${this.selectedDepartment}"
            .departments="${DEPARTMENTS}"
            .language="${this.language}"
            @search-changed="${this._handleSearch}"
            @department-changed="${this._handleDepartmentFilter}">
          </search-filter>
        </div>

        <!-- Employee List/Table -->
        <div class="employees-container">
          ${filteredEmployees.length === 0 ? html`
            <div class="no-results">
              <div class="no-results-icon">🔍</div>
              <div class="no-results-text">${t('employeeList.noResults', this.language)}</div>
              <div class="no-results-subtext">Try adjusting your search or filters</div>
            </div>
          ` : html`
            ${this.viewMode === VIEW_MODES.TABLE ? html`
              <employee-table 
                .employees="${paginatedEmployees}"
                .language="${this.language}">
              </employee-table>
            ` : html`
              <employee-cards 
                .employees="${paginatedEmployees}"
                .language="${this.language}">
              </employee-cards>
            `}
          `}
        </div>

        <!-- Pagination -->
        ${totalPages > 1 ? html`
          <div class="pagination-section">
            <pagination-component
              .currentPage="${this.currentPage}"
              .totalPages="${totalPages}"
              .totalItems="${filteredEmployees.length}"
              .itemsPerPage="${APP_CONSTANTS.ITEMS_PER_PAGE}"
              .language="${this.language}"
              @page-changed="${this._handlePageChange}">
            </pagination-component>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage); 