import { LitElement, html, css } from 'lit';

export class UIInput extends LitElement {
  static properties = {
    type: { type: String }, // 'text', 'email', 'password', 'number', 'tel', 'url', 'date'
    name: { type: String },
    value: { type: String },
    placeholder: { type: String },
    label: { type: String },
    error: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    autocomplete: { type: String },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    size: { type: String } // 'sm', 'md', 'lg'
  };

  static styles = css`
    :host {
      display: block;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      font-weight: 500;
      color: #495057;
      font-size: 0.875rem;
      margin: 0;
    }

    .input-label.required::after {
      content: ' *';
      color: #dc3545;
    }

    .input-wrapper {
      position: relative;
    }

    .input {
      width: 100%;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      background: white;
      color: #495057;
      font-family: inherit;
      box-sizing: border-box;
    }

    .input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .input.error {
      border-color: #dc3545;
    }

    .input.error:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .input:disabled {
      background-color: #f8f9fa;
      color: #6c757d;
      cursor: not-allowed;
    }

    .input:readonly {
      background-color: #f8f9fa;
      cursor: default;
    }

    /* Sizes */
    .input.size-sm {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .input.size-md {
      padding: 0.75rem;
      font-size: 0.875rem;
    }

    .input.size-lg {
      padding: 1rem;
      font-size: 1rem;
    }

    .input::placeholder {
      color: #6c757d;
      opacity: 1;
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
    .input-group:focus-within .input-label {
      color: #ff6200;
    }

    .input-group:focus-within .input-label.error {
      color: #dc3545;
    }
  `;

  constructor() {
    super();
    this.type = 'text';
    this.name = '';
    this.value = '';
    this.placeholder = '';
    this.label = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.autocomplete = '';
    this.min = '';
    this.max = '';
    this.step = '';
    this.size = 'md';
  }

  handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('ui-input', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        value: this.value,
        originalEvent: e
      }
    }));
  }

  handleChange(e) {
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
      <div class="input-group">
        ${this.label ? html`
          <label class="input-label ${this.required ? 'required' : ''} ${this.error ? 'error' : ''}">
            ${this.label}
          </label>
        ` : ''}
        
        <div class="input-wrapper">
          <input
            type=${this.type}
            name=${this.name}
            .value=${this.value}
            placeholder=${this.placeholder}
            class="input size-${this.size} ${this.error ? 'error' : ''}"
            ?required=${this.required}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            autocomplete=${this.autocomplete}
            min=${this.min}
            max=${this.max}
            step=${this.step}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
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

customElements.define('ui-input', UIInput); 