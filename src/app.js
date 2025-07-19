import { LitElement, html, css } from 'lit';
import { AppRouter } from './router/router.js';

/**
 * Main Application Component
 * - Simple state management (without Redux for now)
 * - Router initialization  
 * - Language detection
 */
class EmployeeApp extends LitElement {
  static properties = {
    language: { type: String }
  };

  static styles = css`
    /* CSS Custom Properties - Design System */
    :host {
      /* ING Brand Colors */
      --color-primary: #ff6b35;
      --color-primary-dark: #e55a2b;
      --color-primary-light: #ff8559;
      
      /* Neutral Colors */
      --color-white: #ffffff;
      --color-gray-50: #f8f9fa;
      --color-gray-100: #f1f3f4;
      --color-gray-200: #e9ecef;
      --color-gray-300: #dee2e6;
      --color-gray-400: #ced4da;
      --color-gray-500: #adb5bd;
      --color-gray-600: #6c757d;
      --color-gray-700: #495057;
      --color-gray-800: #343a40;
      --color-gray-900: #212529;
      
      /* Semantic Colors */
      --color-success: #28a745;
      --color-warning: #ffc107;
      --color-error: #dc3545;
      --color-info: #17a2b8;
      
      /* Typography */
      --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                             'Helvetica Neue', Arial, sans-serif;
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 1.875rem;
      
      --font-weight-normal: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;
      --font-weight-bold: 700;
      
      --line-height-tight: 1.25;
      --line-height-normal: 1.5;
      --line-height-relaxed: 1.75;
      
      /* Spacing */
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 0.75rem;
      --spacing-lg: 1rem;
      --spacing-xl: 1.5rem;
      --spacing-2xl: 2rem;
      --spacing-3xl: 3rem;
      --spacing-4xl: 4rem;
      
      /* Borders */
      --border-width: 1px;
      --border-radius-sm: 0.25rem;
      --border-radius-md: 0.375rem;
      --border-radius-lg: 0.5rem;
      --border-radius-xl: 0.75rem;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      
      /* Transitions */
      --transition-fast: 150ms ease-in-out;
      --transition-normal: 300ms ease-in-out;
      --transition-slow: 500ms ease-in-out;
      
      /* Z-index */
      --z-dropdown: 1000;
      --z-sticky: 1020;
      --z-fixed: 1030;
      --z-modal-backdrop: 1040;
      --z-modal: 1050;
      --z-popover: 1060;
      --z-tooltip: 1070;
      
      /* Layout */
      --container-max-width: 1400px;
      --header-height: 60px;
      --sidebar-width: 250px;

      display: block;
      min-height: 100vh;
    }

    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      background: var(--color-primary);
      color: var(--color-white);
      padding: var(--spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }

    .app-header h1 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
    }

    .app-content {
      flex: 1;
      padding: var(--spacing-xl);
      max-width: var(--container-max-width);
      margin: 0 auto;
      width: 100%;
    }

    .language-switcher {
      display: flex;
      gap: var(--spacing-sm);
    }

    .lang-btn {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: var(--color-white);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }

    .lang-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .lang-btn.active {
      background: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.6);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        gap: var(--spacing-md);
        text-align: center;
      }

      .app-content {
        padding: var(--spacing-lg);
      }
    }
  `;

  constructor() {
    super();
    this.language = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    
    console.log('EmployeeApp connected, initializing router...');
    
    // Initialize router after component is connected
    this.updateComplete.then(() => {
      const outlet = this.shadowRoot.querySelector('#router-outlet');
      console.log('Router outlet found:', outlet);
      if (outlet) {
        this.router = new AppRouter(outlet);
        console.log('Router initialized');
      } else {
        console.error('Router outlet not found!');
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _handleLanguageSwitch(lang) {
    this.language = lang;
    document.documentElement.lang = lang;
  }

  render() {
    return html`
      <div class="app-layout">
        <!-- App Header -->
        <header class="app-header">
          <h1>🏢 ING Employee Management</h1>
          
          <div class="language-switcher">
            <button 
              class="lang-btn ${this.language === 'tr' ? 'active' : ''}"
              @click="${() => this._handleLanguageSwitch('tr')}">
              🇹🇷 TR
            </button>
            <button 
              class="lang-btn ${this.language === 'en' ? 'active' : ''}"
              @click="${() => this._handleLanguageSwitch('en')}">
              🇬🇧 EN
            </button>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="app-content">
          <div id="router-outlet"></div>
        </main>
      </div>
    `;
  }
}

customElements.define('employee-app', EmployeeApp); 