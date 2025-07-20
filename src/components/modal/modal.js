import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

export class Modal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    title: { type: String },
    message: { type: String },
    type: { type: String }, // 'confirm', 'alert', 'info'
    confirmText: { type: String },
    cancelText: { type: String },
    isLoading: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    :host([isOpen]) {
      opacity: 1;
      visibility: visible;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .modal-container {
      position: relative;
      background: white;
      border-radius: 16px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      transform: scale(0.9) translateY(20px);
      transition: all 0.3s ease;
    }

    :host([isOpen]) .modal-container {
      transform: scale(1) translateY(0);
    }

    .modal-header {
      padding: 1.5rem 2rem 1rem 2rem;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .modal-icon.danger {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
    }

    .modal-icon.info {
      background: rgba(59, 130, 246, 0.1);
      color: var(--ing-blue);
    }

    .modal-icon.success {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 1.5rem 2rem;
    }

    .modal-message {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    .modal-footer {
      padding: 1rem 2rem 1.5rem 2rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      border-top: 1px solid var(--border-color);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-width: 100px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--ing-orange), #ff8533);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 98, 0, 0.3);
    }

    .btn-danger {
      background: linear-gradient(135deg, var(--error-color), #dc2626);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-secondary {
      background: var(--surface-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--border-color);
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
      .modal-container {
        width: 95%;
        margin: 1rem;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .modal-footer {
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
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.type = 'confirm';
    this.confirmText = '';
    this.cancelText = '';
    this.isLoading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.handleCancel();
    }
  };

  handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      this.handleCancel();
    }
  };

  handleConfirm = () => {
    if (this.isLoading) return;
    
    this.dispatchEvent(new CustomEvent('modal-confirm', {
      bubbles: true,
      composed: true
    }));
  };

  handleCancel = () => {
    if (this.isLoading) return;
    
    this.dispatchEvent(new CustomEvent('modal-cancel', {
      bubbles: true,
      composed: true
    }));
  };

  getIcon() {
    switch (this.type) {
      case 'confirm':
      case 'danger':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '❓';
    }
  }

  getIconClass() {
    switch (this.type) {
      case 'confirm':
      case 'danger':
        return 'danger';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  }

  render() {
    return html`
      <div class="modal-backdrop" @click=${this.handleBackdropClick}>
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">
              <div class="modal-icon ${this.getIconClass()}">
                ${this.getIcon()}
              </div>
              ${this.title}
            </h3>
            <button 
              class="close-button" 
              @click=${this.handleCancel}
              ?disabled=${this.isLoading}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">${this.message}</p>
          </div>

          <div class="modal-footer">
            <button 
              class="btn btn-secondary" 
              @click=${this.handleCancel}
              ?disabled=${this.isLoading}
            >
              ${this.cancelText || i18nService.t('common.cancel')}
            </button>
            
            <button 
              class="btn ${this.type === 'danger' ? 'btn-danger' : 'btn-primary'}" 
              @click=${this.handleConfirm}
              ?disabled=${this.isLoading}
            >
              ${this.isLoading ? html`
                <span class="loading-spinner"></span>
              ` : ''}
              ${this.confirmText || i18nService.t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-modal', Modal); 