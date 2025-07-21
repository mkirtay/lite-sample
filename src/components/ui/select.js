import { LitElement, html, css } from 'lit';

export class UISelect extends LitElement {
  static properties = {
    name: { type: String },
    value: { type: String },
    label: { type: String },
    error: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    options: { type: Array },
    placeholder: { type: String },
    size: { type: String } // 'sm', 'md', 'lg'
  };

  static styles = css`
    :host {
      display: block;
    }

    .select-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .select-label {
      font-weight: 500;
      color: #495057;
      font-size: 0.875rem;
      margin: 0;
    }

    .select-label.required::after {
      content: ' *';
      color: #dc3545;
    }

    .select-wrapper {
      position: relative;
    }

    .select {
      width: 100%;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      background: white;
      color: #495057;
      font-family: inherit;
      box-sizing: border-box;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      padding-right: 2.5rem;
    }

    .select:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .select.error {
      border-color: #dc3545;
    }

    .select.error:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .select:disabled {
      background-color: #f8f9fa;
      color: #6c757d;
      cursor: not-allowed;
    }

    /* Sizes */
    .select.size-sm {
      padding: 0.5rem 2.25rem 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .select.size-md {
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
      font-size: 0.875rem;
    }

    .select.size-lg {
      padding: 1rem 2.75rem 1rem 1rem;
      font-size: 1rem;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.75rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .error-icon {
      font-size: 0.875rem;
    }

    /* Focus within for better UX */
    .select-group:focus-within .select-label {
      color: #ff6200;
    }

    .select-group:focus-within .select-label.error {
      color: #dc3545;
    }

    /* Option styling */
    .select option {
      padding: 0.5rem;
    }

    .select option:disabled {
      color: #6c757d;
      font-style: italic;
    }
  `;

  constructor() {
    super();
    this.name = '';
    this.value = '';
    this.label = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.options = [];
    this.placeholder = '';
    this.size = 'md';
  }

  handleChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('ui-change', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        value: this.value,
        originalEvent: e
      }
    }));
  }

  render() {
    return html`
      <div class="select-group">
        ${this.label ? html`
          <label class="select-label ${this.required ? 'required' : ''} ${this.error ? 'error' : ''}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="select-wrapper">
          <select
            name=${this.name}
            .value=${this.value}
            class="select size-${this.size} ${this.error ? 'error' : ''}"
            ?required=${this.required}
            ?disabled=${this.disabled}
            @change=${this.handleChange}
          >
            ${this.placeholder ? html`
              <option value="" disabled hidden>
                ${this.placeholder}
              </option>
            ` : ''}
            
            ${this.options.map(option => html`
              <option 
                value=${option.value} 
                ?selected=${option.value === this.value}
                ?disabled=${option.disabled}
              >
                ${option.label}
              </option>
            `)}
          </select>
        </div>

        ${this.error ? html`
          <p class="error-message">
            <span class="error-icon">⚠</span>
            ${this.error}
          </p>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('ui-select', UISelect); 