import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import UI components
import '../ui/index.js';
import '../modal/modal.js';

export class EmployeeFormPage extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { type: Object, state: true },
    employees: { type: Array, state: true },
    errors: { type: Object, state: true },
    isLoading: { type: Boolean, state: true },
    isEditMode: { type: Boolean, state: true },
    showConfirmModal: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      min-height: calc(100vh - 120px);
      background: #f8f9fa;
      padding: 2rem 1rem;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
      padding: 2rem;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }

    .form-subtitle {
      color: #6c757d;
      margin: 0;
      font-size: 0.875rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .full-width {
        grid-column: 1 / -1;
      }
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem 0.5rem;
      }

      .form-container {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = '';
    this.isEditMode = false;
    this.isLoading = false;
    this.showConfirmModal = false;
    this.employee = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: '',
      salary: ''
    };
    this.employees = JSON.parse(localStorage.getItem('employees') || '[]');
    this.errors = {};
  }

  connectedCallback() {
    super.connectedCallback();
    i18nService.subscribe(this);
    
    // Extract employeeId from URL params
    const urlParams = new URLSearchParams(window.location.search);
    this.employeeId = urlParams.get('id');
    
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
  }

  loadEmployee() {
    const employee = this.employees.find(emp => emp.id === this.employeeId);
    if (employee) {
      this.employee = { ...employee };
    } else {
      // Redirect if employee not found
      window.location.href = '/employees';
    }
  }

  handleInputChange(event) {
    const { name, value } = event.detail;
    this.employee = {
      ...this.employee,
      [name]: value
    };
    
    // Clear error when user starts typing
    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: ''
      };
    }
  }

  validateForm() {
    const errors = {};

    if (!this.employee.firstName?.trim()) {
      errors.firstName = i18nService.t('validation.required');
    } else if (this.employee.firstName.trim().length < 2) {
      errors.firstName = i18nService.t('validation.minLength', { min: 2 });
    }

    if (!this.employee.lastName?.trim()) {
      errors.lastName = i18nService.t('validation.required');
    } else if (this.employee.lastName.trim().length < 2) {
      errors.lastName = i18nService.t('validation.minLength', { min: 2 });
    }

    if (!this.employee.email?.trim()) {
      errors.email = i18nService.t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(this.employee.email)) {
      errors.email = i18nService.t('validation.invalidEmail');
    }

    if (!this.employee.phone?.trim()) {
      errors.phone = i18nService.t('validation.required');
    }

    if (!this.employee.department?.trim()) {
      errors.department = i18nService.t('validation.required');
    }

    if (!this.employee.position?.trim()) {
      errors.position = i18nService.t('validation.required');
    }

    if (!this.employee.hireDate?.trim()) {
      errors.hireDate = i18nService.t('validation.required');
    }

    if (!this.employee.salary || this.employee.salary <= 0) {
      errors.salary = i18nService.t('validation.required');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    this.showConfirmModal = true; // Show confirmation modal
  }

  handleConfirmSave() {
    this.showConfirmModal = false;
    this.isLoading = true;

    // Simulate API call delay
    setTimeout(() => {
      if (this.isEditMode) {
        // Update existing employee
        const index = this.employees.findIndex(emp => emp.id === this.employeeId);
        if (index !== -1) {
          this.employees[index] = { ...this.employee, id: this.employeeId };
        }
      } else {
        // Add new employee
        const newEmployee = {
          ...this.employee,
          id: Date.now().toString(),
          salary: Number(this.employee.salary)
        };
        this.employees.push(newEmployee);
      }

      // Save to localStorage
      localStorage.setItem('employees', JSON.stringify(this.employees));

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('employee-updated'));

      this.isLoading = false;

      // Redirect to employee list
      window.location.href = '/employees';
    }, 1000);
  }

  handleCancelSave() {
    this.showConfirmModal = false;
  }

  handleCancel() {
    window.location.href = '/employees';
  }

  getDepartmentOptions() {
    return [
      { value: '', label: i18nService.t('employee.selectDepartment'), disabled: true },
      { value: 'Engineering', label: i18nService.t('departments.engineering') },
      { value: 'Marketing', label: i18nService.t('departments.marketing') },
      { value: 'Sales', label: i18nService.t('departments.sales') },
      { value: 'HR', label: i18nService.t('departments.hr') },
      { value: 'Finance', label: i18nService.t('departments.finance') },
      { value: 'Analytics', label: 'Analytics' }
    ];
  }

  render() {
    return html`
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">
            ${this.isEditMode ? i18nService.t('employee.editEmployee') : i18nService.t('employee.addEmployee')}
          </h1>
          <p class="form-subtitle">
            ${this.isEditMode ? i18nService.t('employee.editDescription') : i18nService.t('employee.addDescription')}
          </p>
        </div>

        <form @submit=${this.handleSubmit} class="employee-form">
          <div class="form-grid">
            <ui-input
              name="firstName"
              type="text"
              .value=${this.employee.firstName}
              label="${i18nService.t('employee.firstName')}"
              .error=${this.errors.firstName}
              required
              autocomplete="given-name"
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-input
              name="lastName"
              type="text"
              .value=${this.employee.lastName}
              label="${i18nService.t('employee.lastName')}"
              .error=${this.errors.lastName}
              required
              autocomplete="family-name"
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-input
              name="email"
              type="email"
              .value=${this.employee.email}
              label="${i18nService.t('employee.email')}"
              .error=${this.errors.email}
              required
              autocomplete="email"
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-input
              name="phone"
              type="tel"
              .value=${this.employee.phone}
              label="${i18nService.t('employee.phone')}"
              .error=${this.errors.phone}
              required
              autocomplete="tel"
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-select
              name="department"
              .value=${this.employee.department}
              label="${i18nService.t('employee.department')}"
              .error=${this.errors.department}
              .options=${this.getDepartmentOptions()}
              placeholder="${i18nService.t('employee.selectDepartment')}"
              required
              @ui-change=${this.handleInputChange}
            ></ui-select>

            <ui-input
              name="position"
              type="text"
              .value=${this.employee.position}
              label="${i18nService.t('employee.position')}"
              .error=${this.errors.position}
              required
              autocomplete="organization-title"
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-input
              name="hireDate"
              type="date"
              .value=${this.employee.hireDate}
              label="${i18nService.t('employee.hireDate')}"
              .error=${this.errors.hireDate}
              max=${new Date().toISOString().split('T')[0]}
              required
              @ui-input=${this.handleInputChange}
            ></ui-input>

            <ui-input
              name="salary"
              type="number"
              .value=${this.employee.salary}
              label="${i18nService.t('employee.salary')}"
              .error=${this.errors.salary}
              min="0"
              step="1000"
              required
              @ui-input=${this.handleInputChange}
            ></ui-input>
          </div>

          <div class="form-actions">
            <ui-button
              variant="secondary"
              type="button"
              ?disabled=${this.isLoading}
              @ui-click=${this.handleCancel}
            >
              ${i18nService.t('common.cancel')}
            </ui-button>
            
            <ui-button
              variant="primary"
              type="submit"
              ?loading=${this.isLoading}
              ?disabled=${this.isLoading}
            >
              ${this.isEditMode ? i18nService.t('common.update') : i18nService.t('common.save')}
            </ui-button>
          </div>
        </form>
      </div>

      <app-modal
        ?isOpen=${this.showConfirmModal}
        type="info"
        title="${i18nService.t('common.confirm')}"
        message="${this.isEditMode ? 
          i18nService.t('employee.updateConfirmation') : 
          i18nService.t('employee.saveConfirmation')}"
        confirmText="${this.isEditMode ? i18nService.t('common.update') : i18nService.t('common.save')}"
        cancelText="${i18nService.t('common.cancel')}"
        @modal-confirm=${this.handleConfirmSave}
        @modal-cancel=${this.handleCancelSave}
      ></app-modal>
    `;
  }
}

customElements.define('employee-form-page', EmployeeFormPage); 