import { LitElement, html, css } from 'lit';

export class UIButton extends LitElement {
  static properties = {
    variant: { type: String }, // 'primary', 'secondary', 'danger', 'success'
    size: { type: String }, // 'sm', 'md', 'lg'
    disabled: { type: Boolean },
    loading: { type: Boolean },
    type: { type: String }, // 'button', 'submit', 'reset'
    fullWidth: { type: Boolean }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([fullWidth]) {
      display: block;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      font-family: inherit;
      line-height: 1.2;
      text-align: center;
      white-space: nowrap;
      user-select: none;
      position: relative;
      overflow: hidden;
    }

    :host([fullWidth]) .btn {
      width: 100%;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Sizes */
    .btn.size-sm {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      min-height: 32px;
    }

    .btn.size-md {
      padding: 0.75rem 1.25rem;
      font-size: 0.875rem;
      min-height: 40px;
    }

    .btn.size-lg {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      min-height: 48px;
    }

    /* Variants */
    .btn.variant-primary {
      background: #ff6200;
      color: white;
    }

    .btn.variant-primary:hover:not(:disabled) {
      background: #e55a00;
    }

    .btn.variant-secondary {
      background: #f8f9fa;
      color: #495057;
      border: 1px solid #ced4da;
    }

    .btn.variant-secondary:hover:not(:disabled) {
      background: #e9ecef;
    }

    .btn.variant-danger {
      background: #dc2626;
      color: white;
    }

    .btn.variant-danger:hover:not(:disabled) {
      background: #b91c1c;
    }

    .btn.variant-success {
      background: #16a34a;
      color: white;
    }

    .btn.variant-success:hover:not(:disabled) {
      background: #15803d;
    }

    .btn.variant-outline {
      background: transparent;
      color: #ff6200;
      border: 1px solid #ff6200;
    }

    .btn.variant-outline:hover:not(:disabled) {
      background: #ff6200;
      color: white;
    }

    .btn.variant-ghost {
      background: transparent;
      color: #6b7280;
    }

    .btn.variant-ghost:hover:not(:disabled) {
      background: #f3f4f6;
    }

    /* Loading spinner */
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

    /* Focus styles */
    .btn:focus {
      outline: 2px solid #ff620040;
      outline-offset: 2px;
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
    this.loading = false;
    this.type = 'button';
    this.fullWidth = false;
  }

  handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('ui-click', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: e }
    }));
  }

  render() {
    return html`
      <button
        type=${this.type}
        class="btn variant-${this.variant} size-${this.size}"
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
      >
        ${this.loading ? html`
          <span class="loading-spinner"></span>
        ` : ''}
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('ui-button', UIButton); 