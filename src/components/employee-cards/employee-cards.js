import { LitElement, html, css } from 'lit';
import { t } from '../../i18n/i18n.service.js';
import { formatDate } from '../../utils/helpers.js';
import { Router } from '@vaadin/router';

class EmployeeCards extends LitElement {
  static properties = {
    employees: { type: Array },
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
      min-height: 300px;
    }

    .employee-card {
      background: var(--color-white);
      border: 1px solid var(--color-gray-200);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: all var(--transition-fast);
      position: relative;
    }

    .employee-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-header {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: var(--color-white);
      padding: var(--spacing-lg);
      position: relative;
    }

    .card-checkbox {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      cursor: pointer;
      transform: scale(1.2);
    }

    .employee-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
      line-height: var(--line-height-tight);
    }

    .employee-position {
      font-size: var(--font-size-sm);
      opacity: 0.9;
      margin-bottom: var(--spacing-sm);
    }

    .department-badge {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: var(--color-white);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      display: inline-block;
    }

    .card-body {
      padding: var(--spacing-lg);
    }

    .employee-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    .detail-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-gray-100);
      border-radius: var(--border-radius-sm);
      flex-shrink: 0;
    }

    .detail-label {
      font-weight: var(--font-weight-medium);
      color: var(--color-gray-600);
      min-width: 80px;
    }

    .detail-value {
      color: var(--color-gray-800);
      flex: 1;
    }

    .email-link {
      color: var(--color-primary);
      text-decoration: none;
    }

    .email-link:hover {
      text-decoration: underline;
    }

    .card-actions {
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-gray-50);
      border-top: 1px solid var(--color-gray-200);
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
    }

    .action-btn {
      background: var(--color-white);
      border: 1px solid var(--color-gray-300);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-weight: var(--font-weight-medium);
    }

    .action-btn.edit {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .action-btn.edit:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .action-btn.delete {
      color: var(--color-error);
      border-color: var(--color-error);
    }

    .action-btn.delete:hover {
      background: var(--color-error);
      color: var(--color-white);
    }

    /* Position badge in header */
    .position-indicator {
      position: absolute;
      top: var(--spacing-sm);
      left: var(--spacing-sm);
      background: rgba(255, 255, 255, 0.2);
      color: var(--color-white);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    /* Empty state */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-gray-500);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-lg);
    }

    /* Responsive */
    @media (max-width: 768px) {
      :host {
        padding: var(--spacing-md);
      }

      .cards-container {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .employee-card {
        margin-bottom: var(--spacing-sm);
      }

      .card-actions {
        flex-direction: column;
      }

      .action-btn {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .card-header {
        padding: var(--spacing-md);
      }

      .card-body {
        padding: var(--spacing-md);
      }

      .detail-row {
        flex-wrap: wrap;
      }

      .detail-label {
        min-width: auto;
        width: 100%;
        margin-bottom: var(--spacing-xs);
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.language = 'en';
  }

  _handleEdit(employee) {
    Router.go(`/employees/edit/${employee.id}`);
  }

  _handleDelete(employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      console.log('Delete employee:', employee);
      // Dispatch custom event for parent to handle
      this.dispatchEvent(new CustomEvent('employee-deleted', {
        detail: { employee },
        bubbles: true
      }));
    }
  }

  _renderEmployeeCard(employee) {
    return html`
      <div class="employee-card">
        <!-- Card Header -->
        <div class="card-header">
          <input 
            type="checkbox" 
            class="card-checkbox" 
            id="card-emp-${employee.id}"
          />
          
          <div class="position-indicator">
            ${employee.position}
          </div>
          
          <div class="employee-name">
            ${employee.firstName} ${employee.lastName}
          </div>
          
          <div class="employee-position">
            ${employee.position} • ${employee.department}
          </div>
          
          <div class="department-badge">
            ${employee.department}
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div class="employee-details">
            <!-- Employment Date -->
            <div class="detail-row">
              <div class="detail-icon">📅</div>
              <div class="detail-label">${t('table.dateOfEmployment', this.language)}:</div>
              <div class="detail-value">${formatDate(employee.dateOfEmployment)}</div>
            </div>

            <!-- Birth Date -->
            <div class="detail-row">
              <div class="detail-icon">🎂</div>
              <div class="detail-label">${t('table.dateOfBirth', this.language)}:</div>
              <div class="detail-value">${formatDate(employee.dateOfBirth)}</div>
            </div>

            <!-- Phone -->
            <div class="detail-row">
              <div class="detail-icon">📞</div>
              <div class="detail-label">${t('table.phone', this.language)}:</div>
              <div class="detail-value">
                <a href="tel:${employee.phone}" class="email-link">
                  ${employee.phone}
                </a>
              </div>
            </div>

            <!-- Email -->
            <div class="detail-row">
              <div class="detail-icon">✉️</div>
              <div class="detail-label">${t('table.email', this.language)}:</div>
              <div class="detail-value">
                <a href="mailto:${employee.email}" class="email-link">
                  ${employee.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <button
            class="action-btn edit"
            @click="${() => this._handleEdit(employee)}"
            title="${t('actions.edit', this.language)}"
          >
            ✏️ ${t('actions.edit', this.language)}
          </button>
          <button
            class="action-btn delete"
            @click="${() => this._handleDelete(employee)}"
            title="${t('actions.delete', this.language)}"
          >
            🗑️ ${t('actions.delete', this.language)}
          </button>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <div class="cards-container">
          <div class="empty-state">
            <div class="empty-icon">🎴</div>
            <p>${t('employeeList.noResults', this.language)}</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="cards-container">
        ${this.employees.map(employee => this._renderEmployeeCard(employee))}
      </div>
    `;
  }
}

customElements.define('employee-cards', EmployeeCards); 