import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

export class EmployeeFormPage extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { type: Object, state: true },
    employees: { type: Array, state: true },
    errors: { type: Object, state: true },
    isLoading: { type: Boolean, state: true },
    isEditMode: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      min-height: calc(100vh - 120px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .form-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--ing-orange), var(--ing-blue));
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--ing-dark-blue);
      margin: 0 0 0.5rem 0;
    }

    .form-subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
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
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .required::after {
      content: ' *';
      color: var(--error-color);
    }

    .form-input,
    .form-select {
      padding: 0.875rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--ing-orange);
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .form-input.error,
    .form-select.error {
      border-color: var(--error-color);
    }

    .error-message {
      color: var(--error-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .btn {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--ing-orange), #ff8533);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 98, 0, 0.3);
    }

    .btn-secondary {
      background: var(--surface-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: var(--border-color);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
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

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid #c3e6cb;
    }
  `;

  constructor() {
    super();
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
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.errors = {};
    this.isLoading = false;
    this.isEditMode = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.extractEmployeeId();
    if (this.employeeId) {
      this.loadEmployee();
    }
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
      
      case 'hireDate':
        if (!value) {
          errors[name] = i18nService.t('validation.required');
        } else if (new Date(value) > new Date()) {
          errors[name] = i18nService.t('validation.futureDate');
        }
        break;
      
      case 'salary':
        if (!value || isNaN(value) || Number(value) <= 0) {
          errors[name] = i18nService.t('validation.invalidSalary');
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
    const fields = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'hireDate', 'salary'];
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

  createEmployee() {
    const newEmployee = {
      ...this.employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.employees.push(newEmployee);
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
                <div class="error-message">⚠️ ${this.errors.firstName}</div>
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
                <div class="error-message">⚠️ ${this.errors.lastName}</div>
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
                <div class="error-message">⚠️ ${this.errors.email}</div>
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
                <div class="error-message">⚠️ ${this.errors.phone}</div>
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
                <option value="Engineering">${i18nService.t('departments.engineering')}</option>
                <option value="Marketing">${i18nService.t('departments.marketing')}</option>
                <option value="Sales">${i18nService.t('departments.sales')}</option>
                <option value="HR">${i18nService.t('departments.hr')}</option>
                <option value="Finance">${i18nService.t('departments.finance')}</option>
              </select>
              ${this.errors.department ? html`
                <div class="error-message">⚠️ ${this.errors.department}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="position">
                ${i18nService.t('employee.position')}
              </label>
              <input
                type="text"
                id="position"
                name="position"
                .value=${this.employee.position}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.position ? 'error' : ''}"
                autocomplete="organization-title"
              />
              ${this.errors.position ? html`
                <div class="error-message">⚠️ ${this.errors.position}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="hireDate">
                ${i18nService.t('employee.hireDate')}
              </label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                .value=${this.employee.hireDate}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.hireDate ? 'error' : ''}"
                max=${new Date().toISOString().split('T')[0]}
              />
              ${this.errors.hireDate ? html`
                <div class="error-message">⚠️ ${this.errors.hireDate}</div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label required" for="salary">
                ${i18nService.t('employee.salary')}
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                .value=${this.employee.salary}
                @input=${this.handleInputChange}
                class="form-input ${this.errors.salary ? 'error' : ''}"
                min="0"
                step="1000"
              />
              ${this.errors.salary ? html`
                <div class="error-message">⚠️ ${this.errors.salary}</div>
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
    `;
  }
}

customElements.define('employee-form-page', EmployeeFormPage); 