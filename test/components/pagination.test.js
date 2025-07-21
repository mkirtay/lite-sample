import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/pagination/pagination.js';

describe('PaginationComponent', () => {
  it('should render with default properties', async () => {
    const el = await fixture(html`<pagination-component></pagination-component>`);
    
    expect(el).to.exist;
    expect(el.currentPage).to.equal(1);
    expect(el.totalPages).to.equal(1);
  });

  it('should not render pagination when totalPages is 1 or less', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${1}></pagination-component>`);
    
    const paginationContainer = el.shadowRoot.querySelector('.pagination-container');
    expect(paginationContainer).to.be.null;
  });

  it('should render pagination when totalPages is greater than 1', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${5} .currentPage=${1}></pagination-component>`);
    
    const paginationContainer = el.shadowRoot.querySelector('.pagination-container');
    expect(paginationContainer).to.exist;
  });

  it('should disable previous button on first page', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${5} .currentPage=${1}></pagination-component>`);
    
    const prevButton = el.shadowRoot.querySelector('.pagination-btn');
    expect(prevButton.disabled).to.be.true;
  });

  it('should disable next button on last page', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${5} .currentPage=${5}></pagination-component>`);
    
    const buttons = el.shadowRoot.querySelectorAll('.pagination-btn');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton.disabled).to.be.true;
  });

  it('should mark current page as active', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${5} .currentPage=${3}></pagination-component>`);
    
    const activeButton = el.shadowRoot.querySelector('.pagination-btn.active');
    expect(activeButton).to.exist;
    expect(activeButton.textContent.trim()).to.equal('3');
  });

  it('should dispatch page-changed event when clicking a page button', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${5} .currentPage=${1}></pagination-component>`);
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('page-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    // Click on page 2
    const pageButtons = el.shadowRoot.querySelectorAll('.pagination-btn');
    const page2Button = Array.from(pageButtons).find(btn => 
      btn.textContent.trim() === '2' && !btn.classList.contains('active')
    );
    
    page2Button.click();
    
    expect(eventFired).to.be.true;
    expect(eventDetail.page).to.equal(2);
  });

  it('should calculate visible pages correctly', async () => {
    const el = await fixture(html`<pagination-component .totalPages=${10} .currentPage=${5}></pagination-component>`);
    
    const visiblePages = el.getVisiblePages();
    
    // Should include page 1, some ellipsis/range, and page 10
    expect(visiblePages).to.include(1);
    expect(visiblePages).to.include(10);
    expect(visiblePages).to.include(5); // current page
  });
}); 