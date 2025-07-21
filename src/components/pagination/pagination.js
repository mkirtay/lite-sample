import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

export class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem 0;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .pagination-btn {
      padding: 0.75rem;
      border: 1px solid #e1e5e9;
      background: white;
      color: #495057;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
      min-width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-btn:hover:not(:disabled):not(.ellipsis) {
      border-color: #ff6200;
      background: #ff6200;
      color: white;
    }

    .pagination-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      color: #6c757d;
    }

    .pagination-btn.active {
      background: #ff6200;
      border-color: #ff6200;
      color: white;
      font-weight: 600;
    }

    .pagination-btn.ellipsis {
      border: none;
      background: transparent;
      cursor: default;
      color: #6c757d;
    }

    .pagination-btn.ellipsis:hover {
      background: transparent;
      border: none;
    }

    .pagination-btn.nav-btn {
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }

    .pagination-btn.nav-btn:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #ff6200;
      color: #ff6200;
    }

    .pagination-btn.nav-btn:disabled {
      background: #f8f9fa;
      color: #adb5bd;
      border-color: #e9ecef;
    }

    /* Number buttons styling */
    .pagination-btn:not(.nav-btn):not(.ellipsis) {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }

    .pagination-btn:not(.nav-btn):not(.ellipsis).active {
      background: #ff6200;
      border-color: #ff6200;
      color: white;
    }

    @media (max-width: 768px) {
      .pagination-container {
        gap: 0.25rem;
        padding: 0 1rem;
      }

      .pagination-btn {
        padding: 0.5rem;
        font-size: 0.8rem;
        min-width: 36px;
        height: 36px;
      }

      .pagination-btn:not(.nav-btn):not(.ellipsis) {
        width: 36px;
        height: 36px;
      }

      .pagination-btn.nav-btn {
        padding: 0.5rem 0.75rem;
      }
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
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

  handlePageChange(page) {
    if (page === this.currentPage || page < 1 || page > this.totalPages) {
      return;
    }

    this.dispatchEvent(new CustomEvent('page-changed', {
      detail: { page },
      bubbles: true,
      composed: true
    }));
  }

  getVisiblePages() {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, this.currentPage - delta);
      i <= Math.min(this.totalPages - 1, this.currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithDots.push('...', this.totalPages);
    } else {
      rangeWithDots.push(this.totalPages);
    }

    return rangeWithDots;
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const visiblePages = this.getVisiblePages();

    return html`
      <div class="pagination-container">
        <button
          class="pagination-btn nav-btn"
          @click=${() => this.handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
          title="${i18nService.t('pagination.previous')}"
        >
          ←
        </button>

        ${visiblePages.map(page => 
          page === '...' ? html`
            <button class="pagination-btn ellipsis" disabled>...</button>
          ` : html`
            <button
              class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
              @click=${() => this.handlePageChange(page)}
              title="${i18nService.t('pagination.page')} ${page}"
            >
              ${page}
            </button>
          `
        )}

        <button
          class="pagination-btn nav-btn"
          @click=${() => this.handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
          title="${i18nService.t('pagination.next')}"
        >
          →
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent); 