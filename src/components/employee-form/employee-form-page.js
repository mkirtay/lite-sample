import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import modal component
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

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .required::after {
      content: ' *';
      color: #dc3545;
    }

    .form-input,
    .form-select {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: border-color 0.15s ease;
      background: white;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .form-input.error,
    .form-select.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-width: 100px;
    }

    .btn-primary {
      background: #ff6200;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #e55a00;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #ced4da;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e9ecef;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
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

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '1990-01-15',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.errors = {};
    this.isLoading = false;
    this.isEditMode = false;
    this.showConfirmModal = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.extractEmployeeId();
    if (this.employeeId) {
      this.loadEmployee();
    }
    
    // Subscribe to language changes
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Unsubscribe from language changes
    i18nService.unsubscribe(this);
  }

  extractEmployeeId() {
    const path = window.location.pathname;
    const match = path.match(/\/employees\/edit\/(.+)/);
    if (match) {
      this.employeeId = match[1];
      this.isEditMode = true;
    }
  }

  loadEmployee() {
    const employee = this.employees.find(emp => emp.id === this.employeeId);
    if (employee) {
      this.employee = { ...employee };
    } else {
      // Employee not found, redirect to list
      window.history.pushState({}, '', '/employees');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  validateField(name, value) {
    const errors = { ...this.errors };
    delete errors[name];

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          errors[name] = i18nService.t('validation.required');
        } else if (value.trim().length < 2) {
          errors[name] = i18nService.t('validation.minLength', { min: 2 });
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          errors[name] = i18nService.t('validation.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[name] = i18nService.t('validation.invalidEmail');
        } else if (this.isEmailDuplicate(value)) {
          errors[name] = i18nService.t('validation.emailExists');
        }
        break;
      
      case 'phone':
        if (!value.trim()) {
          errors[name] = i18nService.t('validation.required');
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
          errors[name] = i18nService.t('validation.invalidPhone');
        }
        break;
      
      case 'department':
      case 'position':
        if (!value.trim()) {
          errors[name] = i18nService.t('validation.required');
        }
        break;
      
      case 'dateOfEmployment':
      case 'dateOfBirth':
        if (!value) {
          errors[name] = i18nService.t('validation.required');
        } else if (new Date(value) > new Date()) {
          errors[name] = i18nService.t('validation.futureDate');
        }
        break;
    }

    this.errors = errors;
    return !errors[name];
  }

  isEmailDuplicate(email) {
    return this.employees.some(emp => 
      emp.email.toLowerCase() === email.toLowerCase() && 
      emp.id !== this.employeeId
    );
  }

  validateForm() {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'dateOfEmployment', 'dateOfBirth'];
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field, this.employee[field])) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };
    
    // Real-time validation
    this.validateField(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    // Show confirmation modal instead of directly saving
    this.showConfirmModal = true;
  }

  handleConfirmSave() {
    this.showConfirmModal = false;
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      try {
        if (this.isEditMode) {
          this.updateEmployee();
        } else {
          this.createEmployee();
        }
        
        this.isLoading = false;
        
        // Redirect to employees list
        window.history.pushState({}, '', '/employees');
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        // Dispatch event for list refresh
        window.dispatchEvent(new CustomEvent('employee-updated'));
        
      } catch (error) {
        this.isLoading = false;
        console.error('Error saving employee:', error);
      }
    }, 1000);
  }

  handleCancelSave() {
    this.showConfirmModal = false;
  }

  createEmployee() {
    const newEmployee = {
      ...this.employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.employees.unshift(newEmployee); // En başa ekle (push yerine unshift)
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  updateEmployee() {
    const index = this.employees.findIndex(emp => emp.id === this.employeeId);
    if (index !== -1) {
      this.employees[index] = {
        ...this.employees[index],
        ...this.employee,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('employees', JSON.stringify(this.employees));
    }
  }

  handleCancel() {
    window.history.pushState({}, '', '/employees');
    window.dispatchEvent(new PopStateEvent('popstate'));
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
            <div class="form-group">
              <label class="form-label required" for="firstName">
                ${i18nService.t('employee.firstName')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                .value=${this.employee.firstName}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.firstName ? 'error' : ''}"
                autocomplete="given-name"
              />
              ${this.errors.firstName ? html`
                <div class="error-message">${this.errors.firstName}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="lastName">
                ${i18nService.t('employee.lastName')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                .value=${this.employee.lastName}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.lastName ? 'error' : ''}"
                autocomplete="family-name"
              />
              ${this.errors.lastName ? html`
                <div class="error-message">${this.errors.lastName}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="email">
                ${i18nService.t('employee.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                .value=${this.employee.email}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.email ? 'error' : ''}"
                autocomplete="email"
              />
              ${this.errors.email ? html`
                <div class="error-message">${this.errors.email}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="phone">
                ${i18nService.t('employee.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                .value=${this.employee.phone}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.phone ? 'error' : ''}"
                autocomplete="tel"
              />
              ${this.errors.phone ? html`
                <div class="error-message">${this.errors.phone}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="department">
                ${i18nService.t('employee.department')}
              </label>
              <select
                id="department"
                name="department"
                .value=${this.employee.department}
                @change=${this.handleInputChange}
                class="form-select ${this.errors.department ? 'error' : ''}"
              >
                <option value="">${i18nService.t('employee.selectDepartment')}</option>
                <option value="Analytics">Analytics</option>
                <option value="Tech">Tech</option>
              </select>
              ${this.errors.department ? html`
                <div class="error-message">${this.errors.department}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="position">
                ${i18nService.t('employee.position')}
              </label>
              <select
                id="position"
                name="position"
                .value=${this.employee.position}
                @change=${this.handleInputChange}
                class="form-select ${this.errors.position ? 'error' : ''}"
              >
                <option value="">${i18nService.t('employee.selectPosition')}</option>
                <option value="Junior">${i18nService.t('positions.junior')}</option>
                <option value="Mid">${i18nService.t('positions.mid')}</option>
                <option value="Senior">${i18nService.t('positions.senior')}</option>
              </select>
              ${this.errors.position ? html`
                <div class="error-message">${this.errors.position}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="dateOfEmployment">
                ${i18nService.t('employee.dateOfEmployment')}
              </label>
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                .value=${this.employee.dateOfEmployment}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.dateOfEmployment ? 'error' : ''}"
                max=${new Date().toISOString().split('T')[0]}
              />
              ${this.errors.dateOfEmployment ? html`
                <div class="error-message">${this.errors.dateOfEmployment}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="dateOfBirth">
                ${i18nService.t('employee.dateOfBirth')}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                .value=${this.employee.dateOfBirth}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.dateOfBirth ? 'error' : ''}"
                max=${new Date().toISOString().split('T')[0]}
              />
              ${this.errors.dateOfBirth ? html`
                <div class="error-message">${this.errors.dateOfBirth}</div>
              ` : ''}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click=${this.handleCancel}
              ?disabled=${this.isLoading}
            >
              ${i18nService.t('common.cancel')}
            </button>
            
            <button 
              type="submit" 
              class="btn btn-primary"
              ?disabled=${this.isLoading}
            >
              ${this.isLoading ? html`
                <span class="loading-spinner"></span>
              ` : ''}
              ${this.isEditMode ? i18nService.t('common.update') : i18nService.t('common.save')}
            </button>
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