import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import UI components
import '../ui/index.js';

export class EmployeeCards extends LitElement {
  static properties = {
    employees: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .employee-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .employee-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      border-color: var(--ing-orange);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ing-orange), var(--ing-blue));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .employee-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .employee-title {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0.25rem 0 0 0;
    }

    .card-body {
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .info-row:hover {
      background: var(--surface-secondary);
    }

    .info-icon {
      width: 24px;
      font-size: 1rem;
      text-align: center;
    }

    .info-text {
      flex: 1;
      color: var(--text-primary);
    }

    .department-badge {
      background: linear-gradient(135deg, var(--ing-orange), #ff8533);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .cards-container {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .employee-card {
        padding: 1rem;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
  }

  getInitials(firstName, lastName) {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18nService.getCurrentLanguage() === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  formatSalary(salary) {
    if (!salary) return '';
    return new Intl.NumberFormat(i18nService.getCurrentLanguage() === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: i18nService.getCurrentLanguage() === 'tr' ? 'TRY' : 'USD'
    }).format(salary);
  }

  handleEdit(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: employee,
      bubbles: true,
      composed: true
    }));
  }

  handleDelete(employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: employee,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="cards-container">
        ${this.employees.map(employee => html`
          <div class="employee-card">
            <div class="card-header">
              <div class="avatar">
                ${this.getInitials(employee.firstName, employee.lastName)}
              </div>
              <div>
                <h3 class="employee-name">
                  ${employee.firstName} ${employee.lastName}
                </h3>
                <p class="employee-title">${employee.position}</p>
              </div>
            </div>

            <div class="card-body">
              <div class="info-row">
                <span class="info-icon">📧</span>
                <span class="info-text">${employee.email}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">📱</span>
                <span class="info-text">${employee.phone}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">🏢</span>
                <span class="info-text">
                  <span class="department-badge">${employee.department}</span>
                </span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">📅</span>
                <span class="info-text">${this.formatDate(employee.hireDate)}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">💰</span>
                <span class="info-text">${this.formatSalary(employee.salary)}</span>
              </div>
            </div>

            <div class="card-actions">
              <ui-button
                variant="secondary"
                size="md"
                @ui-click=${() => this.handleEdit(employee)}
                title="${i18nService.t('common.edit')}"
              >
                ✏️ ${i18nService.t('common.edit')}
              </ui-button>
              <ui-button
                variant="danger"
                size="md"
                @ui-click=${() => this.handleDelete(employee)}
                title="${i18nService.t('common.delete')}"
              >
                🗑️ ${i18nService.t('common.delete')}
              </ui-button>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('employee-cards', EmployeeCards); 