import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

export class EmployeeTable extends LitElement {
  static properties = {
    employees: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }

    th {
      background: #f8f9fa;
      font-weight: 500;
      color: #6c757d;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    th.checkbox-col {
      width: 40px;
      text-align: center;
    }

    td.checkbox-col {
      text-align: center;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 0.25rem;
    }

    .btn {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-edit {
      background: #3498db;
      color: white;
    }

    .btn-edit:hover {
      background: #2980b9;
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background: #c0392b;
    }

    .position-badge {
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    // .department-engineering {
    //   background: #20c997;
    // }

    // .department-marketing {
    //   background: #e83e8c;
    // }

    // .department-sales {
    //   background: #28a745;
    // }

    // .department-analytics {
    //   background: #6f42c1;
    // }

    // /* Position badges - daha açık gri */
    // .position-junior {
    //   background: #6c757d;
    // }

    // .position-senior {
    //   background: #495057;
    // }

    // .position-manager {
    //   background: #343a40;
    // }

    .checkbox {
      cursor: pointer;
    }

    @media (max-width: 768px) {
      th, td {
        padding: 0.5rem;
        font-size: 0.8rem;
      }
      
      .actions {
        flex-direction: column;
        gap: 0.125rem;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
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

  handleEdit(employee) {
    this.dispatchEvent(new CustomEvent('edit-employee', {
      detail: { employeeId: employee.id },
      bubbles: true,
      composed: true
    }));
  }

  handleDelete(employee) {
    this.dispatchEvent(new CustomEvent('delete-employee', {
      detail: { employeeId: employee.id },
      bubbles: true,
      composed: true
    }));
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  }

  formatSalary(salary) {
    if (!salary) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(salary);
  }

  render() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-col">
                <input type="checkbox" class="checkbox" />
              </th>
              <th>${i18nService.t('employee.firstName')}</th>
              <th>${i18nService.t('employee.lastName')}</th>
              <th>${i18nService.t('employee.hireDate')}</th>
              <th>${i18nService.t('employee.dateOfBirth')}</th>
              <th>${i18nService.t('employee.phone')}</th>
              <th>${i18nService.t('employee.email')}</th>
              <th>${i18nService.t('employee.department')}</th>
              <th>${i18nService.t('employee.position')}</th>
              <th>${i18nService.t('employee.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(employee => html`
              <tr>
                <td class="checkbox-col">
                  <input type="checkbox" class="checkbox" />
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${this.formatDate(employee.hireDate)}</td>
                <td>${this.formatDate(employee.hireDate)}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>
                  <span class="position-badge ${this.getDepartmentClass(employee.department)}">
                    ${employee.department}
                  </span>
                </td>
                <td>
                  <span class="position-badge ${this.getPositionClass(employee.position)}">${employee.position}</span>
                </td>
                <td>
                  <div class="actions">
                    <button 
                      class="btn btn-edit"
                      @click=${() => this.handleEdit(employee)}
                      title="${i18nService.t('common.edit')}"
                    >
                      ✏️
                    </button>
                    <button 
                      class="btn btn-delete"
                      @click=${() => this.handleDelete(employee)}
                      title="${i18nService.t('common.delete')}"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  getDepartmentClass(department) {
    switch(department.toLowerCase()) {
      case 'engineering': return 'department-engineering';
      case 'marketing': return 'department-marketing';
      case 'sales': return 'department-sales';
      case 'analytics': return 'department-analytics';
      default: return '';
    }
  }

  getPositionClass(position) {
    switch(position.toLowerCase()) {
      case 'junior': return 'position-junior';
      case 'senior': return 'position-senior';
      case 'manager': return 'position-manager';
      default: return '';
    }
  }
}

customElements.define('employee-table', EmployeeTable); 