import { LitElement, html, css } from 'lit';
import { initializeRouter } from './router/router.js';
import { i18nService } from './i18n/i18n.service.js';

// Import UI components
import './components/ui/index.js';

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
      
      /* Spacing */
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      --spacing-xl: 2rem;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      
      /* Transitions */
      --transition-fast: 0.15s ease;
      --transition-normal: 0.3s ease;
      --transition-slow: 0.5s ease;
      
      display: block;
      min-height: 100vh;
      font-family: var(--font-family-primary);
      color: var(--text-primary);
      background: var(--surface-secondary);
    }

    /* Global Layout */
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .app-header {
      background: linear-gradient(135deg, var(--ing-orange), #ff8533);
      color: white;
      padding: 1rem 2rem;
      box-shadow: var(--shadow-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      text-decoration: none;
      font-size: var(--font-size-lg);
      font-weight: 700;
      transition: var(--transition-fast);
    }

    .app-logo:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .logo-icon {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
      border-radius: 8px;
      font-weight: 900;
      font-size: 1rem;
    }

    .header-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .language-switch {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: var(--transition-fast);
      backdrop-filter: blur(10px);
    }

    .language-switch:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    /* Main Content */
    .app-main {
      flex: 1;
      position: relative;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .loading-content {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-color);
      border-top: 3px solid var(--ing-orange);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      margin: 0;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .app-header {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        position: relative;
      }

      .header-controls {
        width: 100%;
        justify-content: space-between;
      }

      .app-logo {
        font-size: var(--font-size-base);
      }
    }

    @media (max-width: 480px) {
      .app-header {
        padding: 0.75rem;
      }

      .app-logo {
        gap: 0.5rem;
      }

      .logo-icon {
        padding: 0.375rem;
        font-size: 0.875rem;
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
    window.location.href = '/employees/add';
  }

  render() {
    return html`
      <div class="app-container">
        <header class="app-header">
          <a href="/employees" class="app-logo">
            <div class="logo-icon">ING</div>
            Employee Management
          </a>
          <div class="header-controls">
            <ui-button
              variant="outline"
              size="md"
              @ui-click=${this.navigateToAddEmployee}
              title="Add New Employee"
            >
              <span style="margin-right: 0.5rem;">+</span>
              Add Employee
            </ui-button>
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

        ${this.isLoading ? html`
          <div class="loading-overlay">
            <div class="loading-content">
              <div class="loading-spinner"></div>
              <p class="loading-text">Loading...</p>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('employee-app', EmployeeApp); 