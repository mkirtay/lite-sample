import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

export class NotFoundPage extends LitElement {
  static properties = {
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: calc(100vh - var(--header-height, 64px));
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }

    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - var(--header-height, 64px));
      padding: 2rem;
      text-align: center;
    }

    .error-illustration {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
    }

    .ing-logo {
      width: 120px;
      height: auto;
      margin-bottom: 1.5rem;
      opacity: 0.8;
    }

    .error-code {
      font-size: 6rem;
      font-weight: 800;
      color: var(--ing-orange, #ff6200);
      line-height: 1;
      margin-bottom: 0.5rem;
      text-shadow: 0 4px 8px rgba(255, 98, 0, 0.2);
    }

    .error-message {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #2c3e50);
      margin-bottom: 1rem;
    }

    .error-description {
      font-size: 1.1rem;
      color: var(--text-secondary, #6c757d);
      max-width: 500px;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--ing-orange, #ff6200);
      color: white;
    }

    .btn-primary:hover {
      background: #e55a2b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 98, 0, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: var(--ing-blue, #003d82);
      border: 2px solid var(--ing-blue, #003d82);
    }

    .btn-secondary:hover {
      background: var(--ing-blue, #003d82);
      color: white;
      transform: translateY(-2px);
    }

    .feature-suggestion {
      margin-top: 3rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      border-left: 4px solid var(--ing-orange, #ff6200);
    }

    .suggestion-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary, #2c3e50);
      margin-bottom: 0.5rem;
    }

    .suggestion-text {
      color: var(--text-secondary, #6c757d);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .not-found-container {
        padding: 1rem;
      }

      .error-code {
        font-size: 4rem;
      }

      .error-message {
        font-size: 1.25rem;
      }

      .error-description {
        font-size: 1rem;
      }

      .action-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .ing-logo {
        width: 80px;
      }
    }
  `;

  constructor() {
    super();
    this.language = document.documentElement.lang || 'tr';
  }

  connectedCallback() {
    super.connectedCallback();
    i18nService.subscribe(this);
    
    // Listen for language changes
    window.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
    window.removeEventListener('language-changed', this.handleLanguageChange);
  }

  handleLanguageChange = (event) => {
    this.language = event.detail.language;
  };

  navigateToEmployees() {
    window.history.pushState({}, '', '/employees');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateToEmployees();
    }
  }

  getTexts() {
    return {
      tr: {
        pageTitle: 'Sayfa Bulunamadı',
        description: 'Aradığınız sayfa taşınmış, silinmiş veya geçici olarak kullanılamıyor olabilir.',
        backToEmployees: 'Çalışan Listesi',
        goBack: 'Geri Dön',
        suggestionTitle: 'İhtiyacınız olan bu mu?',
        suggestionText: 'Çalışan yönetim sistemi ile personel bilgilerini görüntüleyebilir, düzenleyebilir ve yeni çalışanlar ekleyebilirsiniz.'
      },
      en: {
        pageTitle: 'Page Not Found',
        description: 'The page you are looking for might have been moved, deleted, or is temporarily unavailable.',
        backToEmployees: 'Employee List',
        goBack: 'Go Back',
        suggestionTitle: 'Is this what you need?',
        suggestionText: 'With the employee management system, you can view, edit and add new employees.'
      }
    };
  }

  render() {
    const texts = this.getTexts()[this.language] || this.getTexts().tr;

    return html`
      <div class="not-found-container">
        <div class="error-illustration">
          <img 
            src="./src/assets/images/ing-logo.png" 
            alt="ING Logo" 
            class="ing-logo"
          />
          <div class="error-code">404</div>
          <div class="error-message">${texts.pageTitle}</div>
          <div class="error-description">
            ${texts.description}
          </div>
        </div>

        <div class="action-buttons">
          <button 
            class="btn btn-primary"
            @click=${this.navigateToEmployees}
          >
            👥 ${texts.backToEmployees}
          </button>
          <button 
            class="btn btn-secondary"
            @click=${this.goBack}
          >
            ← ${texts.goBack}
          </button>
        </div>

        <div class="feature-suggestion">
          <div class="suggestion-title">${texts.suggestionTitle}</div>
          <div class="suggestion-text">${texts.suggestionText}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage); 