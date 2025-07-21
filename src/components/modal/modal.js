import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import UI components
import '../ui/index.js';

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
      transition: all 0.2s ease;
    }

    :host([isOpen]) {
      opacity: 1;
      visibility: visible;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-container {
      position: relative;
      background: white;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: scale(0.95);
      transition: transform 0.2s ease;
      margin: auto;
    }

    :host([isOpen]) .modal-container {
      transform: scale(1);
    }

    .modal-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      position: relative;
    }

    .modal-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .modal-icon.danger {
      background: #fef2f2;
      color: #dc2626;
    }

    .modal-icon.info {
      background: #eff6ff;
      color: #2563eb;
    }

    .modal-icon.success {
      background: #f0fdf4;
      color: #16a34a;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      color: #6b7280;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      transition: all 0.15s ease;
    }

    .close-button:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .modal-message {
      color: #4b5563;
      line-height: 1.5;
      margin: 0;
      font-size: 0.875rem;
    }

    .modal-footer {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .modal-backdrop {
        padding: 0.5rem;
      }

      .modal-container {
        max-width: none;
        width: 100%;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .modal-footer {
        flex-direction: column;
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
    i18nService.subscribe(this);
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
    document.removeEventListener('keydown', this.handleKeydown);
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
        return '!';
      case 'info':
        return 'i';
      case 'success':
        return '✓';
      default:
        return '?';
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
              ×
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">${this.message}</p>
          </div>

          <div class="modal-footer">
            <ui-button
              variant="secondary"
              size="md"
              ?disabled=${this.isLoading}
              @ui-click=${this.handleCancel}
            >
              ${this.cancelText || i18nService.t('common.cancel')}
            </ui-button>
            
            <ui-button
              variant="${this.type === 'danger' ? 'danger' : 'primary'}"
              size="md"
              ?loading=${this.isLoading}
              ?disabled=${this.isLoading}
              @ui-click=${this.handleConfirm}
            >
              ${this.confirmText || i18nService.t('common.confirm')}
            </ui-button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-modal', Modal); 