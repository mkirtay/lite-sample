import { LitElement, html, css } from 'lit';
import { initializeRouter } from './router/router.js';
import { i18nService } from './i18n/i18n.service.js';

/**
 * Main Application Component
 * - Simple state management (without Redux for now)
 * - Router initialization  
 * - Language detection
 */
class EmployeeApp extends LitElement {
  static properties = {
    language: { type: String },
    isLoading: { type: Boolean, state: true }
  };

  static styles = css`
    /* CSS Custom Properties - Design System */
    :host {
      /* ING Brand Colors */
      --ing-orange: #ff6200;
      --ing-blue: #003d82;
      --ing-dark-blue: #001b39;
      
      /* Neutral Colors */
      --color-white: #ffffff;
      --surface-primary: #ffffff;
      --surface-secondary: #f8f9fa;
      
      /* Border & Dividers */
      --border-color: #e1e5e9;
      --divider-color: #f0f2f5;
      
      /* Text Colors */
      --text-primary: #2c3e50;
      --text-secondary: #6c757d;
      --text-muted: #95a5a6;
      
      /* Status Colors */
      --success-color: #27ae60;
      --warning-color: #f39c12;
      --error-color: #e74c3c;
      --info-color: #3498db;
      
      /* Typography */
      --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                             'Helvetica Neue', Arial, sans-serif;
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      
      /* Spacing Scale */
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      --spacing-2xl: 3rem;
      --spacing-3xl: 4rem;
      --spacing-4xl: 6rem;
      
      /* Border Radius */
      --border-radius-sm: 4px;
      --border-radius-md: 8px;
      --border-radius-lg: 12px;
      --border-radius-xl: 16px;
      
      /* Box Shadow */
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
      
      /* Transitions */
      --transition-fast: 150ms ease;
      --transition-normal: 300ms ease;
      --transition-slow: 500ms ease;
      
      /* Layout */
      --container-max-width: 1200px;
      --header-height: 64px;
      --sidebar-width: 256px;
      
      /* Apply base styles */
      display: block;
      font-family: var(--font-family-primary);
      color: var(--text-primary);
      background: var(--surface-primary);
      min-height: 100vh;
    }

    /* Global loading screen */
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--ing-orange) 0%, var(--ing-blue) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 1.25rem;
      font-weight: 500;
    }

    /* Header Styles */
    .app-header {
      background: white;
      border-bottom: 1px solid var(--border-color);
      padding: 0 2rem;
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--ing-dark-blue);
      text-decoration: none;
    }

    .logo-icon{
    max-width: 50px;
    }

    .logo-svg {
      height: 32px;
      width: auto;
      object-fit: contain;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .add-employee-btn {
      background: var(--ing-orange);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .add-employee-btn:hover {
      background: #e55a2b;
      transform: translateY(-1px);
    }

    .employees-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .language-switch {
      background: var(--surface-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: 0.5rem 1rem;
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--text-primary);
    }

    .language-switch:hover {
      background: var(--border-color);
    }

    /* Main Content */
    .app-main {
      min-height: calc(100vh - var(--header-height));
    }

    /* Router Outlet */
    .router-outlet {
      width: 100%;
      display: block;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .app-header {
        padding: 0 1rem;
      }
      
      .app-logo {
        font-size: 1.25rem;
      }
      
      .logo-icon {
        width: 28px;
        height: 28px;
      }

      .header-controls {
        gap: 0.5rem;
      }

      .add-employee-btn {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }

      .add-employee-btn span {
        display: none;
      }

      .language-switch {
        padding: 0.5rem;
        min-width: 36px;
      }
    }
  `;

  constructor() {
    super();
    // Load saved language preference or default to Turkish
    const savedLanguage = localStorage.getItem('preferred-language');
    this.language = savedLanguage || document.documentElement.lang || 'tr';
    
    // Set initial document language
    document.documentElement.lang = this.language;
    
    this.isLoading = true;
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

  firstUpdated() {
    // Initialize router after component is rendered
    setTimeout(() => {
      const outlet = this.shadowRoot.querySelector('.router-outlet');
      console.log('🎯 Router outlet found:', outlet);
      
      if (outlet) {
        initializeRouter(outlet);
        // Hide loading screen after router is ready
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      } else {
        console.error('❌ Router outlet not found!');
        this.isLoading = false;
      }
    }, 100);
  }

  toggleLanguage() {
    const oldLang = this.language;
    this.language = this.language === 'tr' ? 'en' : 'tr';
    document.documentElement.lang = this.language;
    
    console.log('🔄 Language toggled from', oldLang, 'to', this.language);
    
    // Store language preference
    localStorage.setItem('preferred-language', this.language);
    
    // Trigger re-render of components
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { language: this.language }
    }));
    
    // Force re-render of this component
    this.requestUpdate();
  }

  navigateToAddEmployee() {
    window.history.pushState({}, '', '/employees/add');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return html`
      ${this.isLoading ? html`
        <div class="loading-screen">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading Employee Management System...</div>
        </div>
      ` : ''}

      <header class="app-header">
        <a href="/employees" class="app-logo">
          <img class="logo-icon" src="./src/assets/images/ing-logo.png" alt="ING Logo" />
          ING
        </a>
        
        <div class="header-controls">
          <button 
            class="add-employee-btn"
            @click=${this.navigateToAddEmployee}
            title="Add New Employee"
          >
            <span class="employees-icon">+</span>
            Add Employee
          </button>
          
          <button 
            class="language-switch"
            @click=${this.toggleLanguage}
            title="Switch Language"
          >
            🌐 ${this.language.toUpperCase()}
          </button>
        </div>
      </header>

      <main class="app-main">
        <div class="router-outlet"></div>
      </main>
    `;
  }
}

customElements.define('employee-app', EmployeeApp); 