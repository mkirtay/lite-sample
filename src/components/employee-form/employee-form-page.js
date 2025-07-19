import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

class EmployeeFormPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-xl);
    }

    .placeholder {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-gray-600);
    }

    .back-btn {
      background: var(--color-gray-100);
      border: 1px solid var(--color-gray-300);
      color: var(--color-gray-700);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-bottom: var(--spacing-xl);
    }

    .back-btn:hover {
      background: var(--color-gray-200);
    }
  `;

  _handleBack() {
    Router.go('/employees');
  }

  render() {
    return html`
      <button class="back-btn" @click="${this._handleBack}">
        ← Back to Employee List
      </button>
      
      <div class="placeholder">
        <h2>🚧 Employee Form - Coming Soon</h2>
        <p>This page will be implemented in Phase 3</p>
        <p>Add/Edit employee functionality will be here</p>
      </div>
    `;
  }
}

customElements.define('employee-form-page', EmployeeFormPage); 