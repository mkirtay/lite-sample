import { LitElement, html, css } from 'lit';
import { t } from '../../i18n/i18n.service.js';
import { formatDate } from '../../utils/helpers.js';
import { Router } from '@vaadin/router';

class EmployeeTable extends LitElement {
  static properties = {
    employees: { type: Array },
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-container {
      overflow-x: auto;
      min-height: 300px;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }

    .employee-table th {
      background: var(--color-gray-50);
      padding: var(--spacing-md) var(--spacing-lg);
      text-align: left;
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-700);
      border-bottom: 2px solid var(--color-gray-200);
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .employee-table td {
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--color-gray-200);
      color: var(--color-gray-700);
      vertical-align: middle;
    }

    .employee-table tr:hover {
      background: var(--color-gray-50);
    }

    .checkbox-cell {
      width: 50px;
      text-align: center;
    }

    .checkbox-cell input[type="checkbox"] {
      cursor: pointer;
      transform: scale(1.1);
    }

    .actions-cell {
      width: 120px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-xs);
      justify-content: center;
    }

    .action-btn {
      background: none;
      border: 1px solid transparent;
      padding: var(--spacing-xs);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: var(--font-size-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
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

    .employee-name {
      font-weight: var(--font-weight-medium);
      color: var(--color-gray-800);
    }

    .employee-email {
      color: var(--color-primary);
      text-decoration: none;
    }

    .employee-email:hover {
      text-decoration: underline;
    }

    .department-badge {
      background: var(--color-primary);
      color: var(--color-white);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
    }

    .department-badge.analytics {
      background: var(--color-info);
    }

    .department-badge.tech {
      background: var(--color-success);
    }

    .position-badge {
      background: var(--color-gray-100);
      color: var(--color-gray-700);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      white-space: nowrap;
    }

    .position-badge.senior {
      background: var(--color-success);
      color: var(--color-white);
    }

    .position-badge.medior {
      background: var(--color-warning);
      color: var(--color-white);
    }

    .position-badge.junior {
      background: var(--color-info);
      color: var(--color-white);
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-gray-500);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .employee-table th,
      .employee-table td {
        padding: var(--spacing-sm);
      }

      .action-buttons {
        flex-direction: column;
      }
    }

    @media (max-width: 768px) {
      .table-container {
        font-size: var(--font-size-xs);
      }

      /* Hide less important columns on mobile */
      .employee-table .date-birth-col,
      .employee-table .phone-col {
        display: none;
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

  _getDepartmentBadgeClass(department) {
    return department.toLowerCase();
  }

  _getPositionBadgeClass(position) {
    return position.toLowerCase();
  }

  _renderEmployeeRow(employee) {
    return html`
      <tr>
        <td class="checkbox-cell">
          <input type="checkbox" id="emp-${employee.id}" />
        </td>
        
        <td>
          <div class="employee-name">${employee.firstName}</div>
        </td>
        
        <td>
          <div class="employee-name">${employee.lastName}</div>
        </td>
        
        <td>${formatDate(employee.dateOfEmployment)}</td>
        
        <td class="date-birth-col">${formatDate(employee.dateOfBirth)}</td>
        
        <td class="phone-col">${employee.phone}</td>
        
        <td>
          <a href="mailto:${employee.email}" class="employee-email">
            ${employee.email}
          </a>
        </td>
        
        <td>
          <span class="department-badge ${this._getDepartmentBadgeClass(employee.department)}">
            ${employee.department}
          </span>
        </td>
        
        <td>
          <span class="position-badge ${this._getPositionBadgeClass(employee.position)}">
            ${employee.position}
          </span>
        </td>
        
        <td class="actions-cell">
          <div class="action-buttons">
            <button
              class="action-btn edit"
              @click="${() => this._handleEdit(employee)}"
              title="${t('actions.edit', this.language)}"
            >
              ✏️
            </button>
            <button
              class="action-btn delete"
              @click="${() => this._handleDelete(employee)}"
              title="${t('actions.delete', this.language)}"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  render() {
    if (!this.employees || this.employees.length === 0) {
      return html`
        <div class="empty-state">
          <p>${t('employeeList.noResults', this.language)}</p>
        </div>
      `;
    }

    return html`
      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input type="checkbox" id="select-all" />
              </th>
              <th>${t('table.firstName', this.language)}</th>
              <th>${t('table.lastName', this.language)}</th>
              <th>${t('table.dateOfEmployment', this.language)}</th>
              <th class="date-birth-col">${t('table.dateOfBirth', this.language)}</th>
              <th class="phone-col">${t('table.phone', this.language)}</th>
              <th>${t('table.email', this.language)}</th>
              <th>${t('table.department', this.language)}</th>
              <th>${t('table.position', this.language)}</th>
              <th class="actions-cell">${t('table.actions', this.language)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => this._renderEmployeeRow(employee))}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeTable); 