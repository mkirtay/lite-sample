import { LitElement, html, css } from 'lit';
import { i18nService } from '../../i18n/i18n.service.js';

// Import UI components
import '../ui/index.js';

export class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 2rem;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .pagination-btn.ellipsis {
      border: none;
      background: none;
      cursor: default;
      padding: 0.75rem 1rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .pagination-container {
        gap: 0.25rem;
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
    i18nService.subscribe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18nService.unsubscribe(this);
  }

  handlePageChange(page) {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.dispatchEvent(new CustomEvent('page-changed', {
        detail: { page },
        bubbles: true,
        composed: true
      }));
    }
  }

  getVisiblePages() {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, this.currentPage - delta);
         i <= Math.min(this.totalPages - 1, this.currentPage + delta);
         i++) {
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

    // Remove duplicates
    return rangeWithDots.filter((item, index, arr) => 
      arr.indexOf(item) === index
    );
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const visiblePages = this.getVisiblePages();

    return html`
      <div class="pagination-container">
        <ui-button
          variant="secondary"
          size="sm"
          ?disabled=${this.currentPage === 1}
          @ui-click=${() => this.handlePageChange(this.currentPage - 1)}
          title="${i18nService.t('pagination.previous')}"
        >
          ← ${i18nService.t('pagination.previous')}
        </ui-button>

        ${visiblePages.map(page => 
          page === '...' ? html`
            <button class="pagination-btn ellipsis" disabled>...</button>
          ` : html`
            <ui-button
              variant="${page === this.currentPage ? 'primary' : 'secondary'}"
              size="sm"
              @ui-click=${() => this.handlePageChange(page)}
              title="${i18nService.t('pagination.page')} ${page}"
            >
              ${page}
            </ui-button>
          `
        )}

        <ui-button
          variant="secondary"
          size="sm"
          ?disabled=${this.currentPage === this.totalPages}
          @ui-click=${() => this.handlePageChange(this.currentPage + 1)}
          title="${i18nService.t('pagination.next')}"
        >
          ${i18nService.t('pagination.next')} →
        </ui-button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent); 