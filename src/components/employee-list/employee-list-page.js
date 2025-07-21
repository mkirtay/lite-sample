import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import child components
import '../employee-table/employee-table.js';
import '../employee-cards/employee-cards.js';
import '../search-filter/search-filter.js';
import '../pagination/pagination.js';
import '../modal/modal.js';

export class EmployeeListPage extends LitElement {
  static properties = {
    employees: { type: Array, state: true },
    filteredEmployees: { type: Array, state: true },
    paginatedEmployees: { type: Array, state: true },
    searchTerm: { type: String, state: true },
    selectedDepartment: { type: String, state: true },
    currentPage: { type: Number, state: true },
    itemsPerPage: { type: Number },
    viewMode: { type: String, state: true },
    isLoading: { type: Boolean, state: true },
    showDeleteModal: { type: Boolean, state: true },
    employeeToDelete: { type: Object, state: true }
  };

  static styles = css`
    :host {
      display: block;
      min-height: calc(100vh - 120px);
      background: #f8f9fa;
      padding: 2rem;
    }

    .page-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-text h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ff6200;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .add-employee-btn {
      background: #ff6200;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .add-employee-btn:hover {
      background: #e55a2b;
    }

    .employees-icon {
      background: #ff6200;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .language-switch {
      background: white;
      border: 1px solid #e1e5e9;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      min-width: 40px;
      text-align: center;
    }

    .content-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e1e5e9;
      overflow: hidden;
    }

    .controls-section {
      padding: 1rem 2rem;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-filter-container {
      flex: 1;
      margin-right: 2rem;
    }

    .view-toggle {
      display: flex;
      gap: 0.25rem;
      background: white;
      padding: 0.25rem;
      border-radius: 6px;
      border: 1px solid #e1e5e9;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6c757d;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .view-btn.active {
      background: #ff6200;
      color: white;
    }

    .results-section {
      padding: 0;
    }

    .results-header {
      padding: 1rem 2rem;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
    }

    .results-count {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e1e5e9;
      border-top: 3px solid #ff6200;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }

      .controls-section {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .search-filter-container {
        margin-right: 0;
      }

      .view-toggle {
        justify-content: center;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.paginatedEmployees = [];
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.viewMode = 'table';
    this.isLoading = true;
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
    // Listen for employee updates from form
    window.addEventListener('employee-updated', this.handleEmployeeUpdate.bind(this));
    
    // Subscribe to language changes
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('employee-updated', this.handleEmployeeUpdate.bind(this));
    
    // Unsubscribe from language changes
    i18nService.unsubscribe(this);
  }

  handleEmployeeUpdate() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        this.employees = JSON.parse(storedEmployees);
      } else {
        // Initialize with demo data if empty
        this.employees = this.createDemoData();
        localStorage.setItem('employees', JSON.stringify(this.employees));
      }
      
      this.isLoading = false;
      this.filterAndPaginate();
    }, 500);
  }

  createDemoData() {
    // Same generation logic as in store for consistency
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria', 'Christopher', 'Jennifer', 'William', 'Linda', 'Daniel', 'Elizabeth', 'Matthew', 'Barbara', 'Anthony', 'Susan', 'Mark', 'Jessica', 'Donald', 'Karen', 'Steven', 'Nancy', 'Paul', 'Betty', 'Andrew', 'Helen', 'Joshua', 'Sandra', 'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian', 'Ruth', 'George', 'Sharon', 'Timothy', 'Michelle', 'Ronald', 'Laura', 'Jason', 'Sarah', 'Edward', 'Kimberly', 'Jeffrey', 'Deborah'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    
    const departments = ['Analytics', 'Tech'];
    const positions = ['Junior', 'Mid', 'Senior'];
    
    const getRandomDate = (startYear, endYear) => {
      const start = new Date(startYear, 0, 1);
      const end = new Date(endYear, 11, 31);
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return randomDate.toISOString().split('T')[0];
    };
    
    const getRandomPhone = () => {
      const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
      return `+90 5${randomNum.toString().slice(0, 2)} ${randomNum.toString().slice(2, 5)} ${randomNum.toString().slice(5, 9)}`;
    };

    return Array.from({ length: 65 }, (_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: (index + 1).toString(),
        firstName,
        lastName,
        dateOfEmployment: getRandomDate(2018, 2024),
        dateOfBirth: getRandomDate(1980, 2000),
        phone: getRandomPhone(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department,
        position
      };
    });
  }

  handleSearch(e) {
    this.searchTerm = e.detail.searchTerm;
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  handleFilter(e) {
    this.selectedDepartment = e.detail.department;
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
    this.filterAndPaginate();
  }

  handleViewToggle(mode) {
    this.viewMode = mode;
  }

  handleEditEmployee(e) {
    const employeeId = e.detail.employeeId;
    window.history.pushState({}, '', `/employees/edit/${employeeId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  handleDeleteEmployee(e) {
    const employeeId = e.detail.employeeId;
    this.employeeToDelete = this.employees.find(emp => emp.id === employeeId);
    this.showDeleteModal = true;
  }

  handleDeleteConfirm() {
    if (!this.employeeToDelete) return;

    this.employees = this.employees.filter(emp => emp.id !== this.employeeToDelete.id);
    localStorage.setItem('employees', JSON.stringify(this.employees));
    
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.filterAndPaginate();
  }

  handleDeleteCancel() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  filterAndPaginate() {
    // Apply search filter
    let filtered = this.employees.filter(employee => {
      const searchLower = this.searchTerm.toLowerCase();
      return (
        employee.firstName.toLowerCase().includes(searchLower) ||
        employee.lastName.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.phone.includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower)
      );
    });

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(employee => 
        employee.department === this.selectedDepartment
      );
    }

    this.filteredEmployees = filtered;

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = filtered.slice(startIndex, endIndex);
  }

  navigateToAddEmployee() {
    window.history.pushState({}, '', '/employees/add');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);

    return html`
      <div class="page-container">
        <div class="page-header">
          <div class="header-content">
            <div class="header-text">
              <h1>${i18nService.t('employee.title')}</h1>
            </div>
          </div>
        </div>

        <div class="content-container">
          <div class="controls-section">
            <div class="search-filter-container">
              <search-filter 
                @search-changed=${this.handleSearch}
                @filter-changed=${this.handleFilter}
              ></search-filter>
            </div>
            
            <div class="view-toggle">
              <button 
                class="view-btn ${this.viewMode === 'table' ? 'active' : ''}"
                @click=${() => this.handleViewToggle('table')}
              >
                ☰ ${i18nService.t('common.table')}
              </button>
              <button 
                class="view-btn ${this.viewMode === 'cards' ? 'active' : ''}"
                @click=${() => this.handleViewToggle('cards')}
              >
                ⚏ ${i18nService.t('common.cards')}
              </button>
            </div>
          </div>

          ${this.isLoading ? html`
            <div class="loading-container">
              <div class="loading-spinner"></div>
              <p>${i18nService.t('common.loading')}</p>
            </div>
          ` : this.paginatedEmployees.length === 0 ? html`
            <div class="no-results">
              <div class="no-results-icon">👤</div>
              <h3>${i18nService.t('common.noResults')}</h3>
            </div>
          ` : html`
            <div class="results-header">
              <div class="results-count">
                ${i18nService.t('pagination.showing', {
                  start: (this.currentPage - 1) * this.itemsPerPage + 1,
                  end: Math.min(this.currentPage * this.itemsPerPage, this.filteredEmployees.length),
                  total: this.filteredEmployees.length
                })}
              </div>
            </div>

            <div class="results-section">
              ${this.viewMode === 'table' ? html`
                <employee-table 
                  .employees=${this.paginatedEmployees}
                  @edit-employee=${this.handleEditEmployee}
                  @delete-employee=${this.handleDeleteEmployee}
                ></employee-table>
              ` : html`
                <employee-cards 
                  .employees=${this.paginatedEmployees}
                  @edit-employee=${this.handleEditEmployee}
                  @delete-employee=${this.handleDeleteEmployee}
                ></employee-cards>
              `}
            </div>

            ${totalPages > 1 ? html`
              <pagination-component
                .currentPage=${this.currentPage}
                .totalPages=${totalPages}
                @page-changed=${this.handlePageChange}
              ></pagination-component>
            ` : ''}
          `}
        </div>
      </div>

      <app-modal
        ?isOpen=${this.showDeleteModal}
        type="danger"
        title="${i18nService.t('common.confirm')}"
        message="${this.employeeToDelete ? 
          i18nService.t('employee.deleteConfirmation', {
            name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`
          }) : ''}"
        confirmText="${i18nService.t('common.delete')}"
        cancelText="${i18nService.t('common.cancel')}"
        @modal-confirm=${this.handleDeleteConfirm}
        @modal-cancel=${this.handleDeleteCancel}
      ></app-modal>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage); 