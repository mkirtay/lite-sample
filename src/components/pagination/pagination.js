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
      margin-top: 2rem;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .pagination-btn {
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      background: white;
      color: var(--text-primary);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      font-weight: 500;
      min-width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-btn:hover:not(:disabled) {
      border-color: var(--ing-orange);
      background: var(--ing-orange);
      color: white;
      transform: translateY(-1px);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .pagination-btn.active {
      background: var(--ing-orange);
      border-color: var(--ing-orange);
      color: white;
    }

    .pagination-btn.ellipsis {
      border: none;
      background: none;
      cursor: default;
    }

    .pagination-btn.ellipsis:hover {
      background: none;
      border: none;
      transform: none;
    }

    @media (max-width: 768px) {
      .pagination-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        min-width: 36px;
      }
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
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
          class="pagination-btn"
          @click=${() => this.handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
          title="${i18nService.t('pagination.previous')}"
        >
          ← ${i18nService.t('pagination.previous')}
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
          class="pagination-btn"
          @click=${() => this.handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
          title="${i18nService.t('pagination.next')}"
        >
          ${i18nService.t('pagination.next')} →
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent); 