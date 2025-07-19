import { LitElement, html, css } from 'lit';
import { t } from '../../i18n/i18n.service.js';

class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
    totalItems: { type: Number },
    itemsPerPage: { type: Number },
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--color-gray-600);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .pagination-btn {
      background: var(--color-white);
      border: 1px solid var(--color-gray-300);
      color: var(--color-gray-700);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--color-gray-50);
      border-color: var(--color-gray-400);
    }

    .pagination-btn:disabled {
      background: var(--color-gray-100);
      color: var(--color-gray-400);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .pagination-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-white);
    }

    .pagination-btn.active:hover {
      background: var(--color-primary-dark);
      border-color: var(--color-primary-dark);
    }

    .page-numbers {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .ellipsis {
      padding: var(--spacing-sm);
      color: var(--color-gray-500);
      font-size: var(--font-size-sm);
    }

    .nav-btn {
      font-weight: var(--font-weight-medium);
      min-width: 80px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        text-align: center;
      }

      .pagination-info {
        order: 2;
      }

      .pagination-controls {
        order: 1;
        flex-wrap: wrap;
        justify-content: center;
      }

      .pagination-btn {
        min-width: 36px;
        height: 36px;
        padding: var(--spacing-xs) var(--spacing-sm);
      }

      .nav-btn {
        min-width: 70px;
      }
    }

    @media (max-width: 480px) {
      .page-numbers {
        gap: 2px;
      }

      .pagination-btn {
        min-width: 32px;
        height: 32px;
        font-size: var(--font-size-xs);
      }

      .nav-btn {
        min-width: 60px;
        font-size: var(--font-size-xs);
      }
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalItems = 0;
    this.itemsPerPage = 10;
    this.language = 'en';
  }

  get startItem() {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem() {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get visiblePages() {
    const pages = [];
    const maxVisible = 5; // Maximum number of page buttons to show
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get showFirstEllipsis() {
    return this.visiblePages[0] > 2;
  }

  get showLastEllipsis() {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
  }

  _handlePageChange(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.dispatchEvent(new CustomEvent('page-changed', {
        detail: { page },
        bubbles: true
      }));
    }
  }

  _handlePrevious() {
    if (this.currentPage > 1) {
      this._handlePageChange(this.currentPage - 1);
    }
  }

  _handleNext() {
    if (this.currentPage < this.totalPages) {
      this._handlePageChange(this.currentPage + 1);
    }
  }

  _renderPageButton(page) {
    const isActive = page === this.currentPage;
    
    return html`
      <button
        class="pagination-btn ${isActive ? 'active' : ''}"
        @click="${() => this._handlePageChange(page)}"
        aria-label="Page ${page}"
        aria-current="${isActive ? 'page' : 'false'}"
      >
        ${page}
      </button>
    `;
  }

  render() {
    if (this.totalPages <= 1) {
      return html`
        <div class="pagination-container">
          <div class="pagination-info">
            ${this.totalItems} ${t('employeeList.totalEmployees', this.language)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="pagination-container">
        <!-- Pagination Info -->
        <div class="pagination-info">
          Showing ${this.startItem} to ${this.endItem} of ${this.totalItems} ${t('employeeList.totalEmployees', this.language)}
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls">
          <!-- Previous Button -->
          <button
            class="pagination-btn nav-btn"
            @click="${this._handlePrevious}"
            ?disabled="${this.currentPage === 1}"
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <!-- Page Numbers -->
          <div class="page-numbers">
            <!-- First page if not visible -->
            ${this.visiblePages[0] > 1 ? html`
              ${this._renderPageButton(1)}
              ${this.showFirstEllipsis ? html`<span class="ellipsis">...</span>` : ''}
            ` : ''}

            <!-- Visible page numbers -->
            ${this.visiblePages.map(page => this._renderPageButton(page))}

            <!-- Last page if not visible -->
            ${this.visiblePages[this.visiblePages.length - 1] < this.totalPages ? html`
              ${this.showLastEllipsis ? html`<span class="ellipsis">...</span>` : ''}
              ${this._renderPageButton(this.totalPages)}
            ` : ''}
          </div>

          <!-- Next Button -->
          <button
            class="pagination-btn nav-btn"
            @click="${this._handleNext}"
            ?disabled="${this.currentPage === this.totalPages}"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent); 