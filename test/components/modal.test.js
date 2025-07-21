import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../../src/components/modal/modal.js';

describe('Modal', () => {
  it('should render with default properties', async () => {
    const el = await fixture(html`<app-modal></app-modal>`);
    
    expect(el).to.exist;
    expect(el.isOpen).to.be.false;
    expect(el.title).to.equal('');
    expect(el.message).to.equal('');
    expect(el.type).to.equal('confirm');
    expect(el.isLoading).to.be.false;
  });

  it('should be hidden by default', async () => {
    const el = await fixture(html`<app-modal></app-modal>`);
    
    // Modal should not have isOpen attribute
    expect(el.hasAttribute('isopen')).to.be.false;
    
    // CSS should make it invisible
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.visibility).to.equal('hidden');
    expect(computedStyle.opacity).to.equal('0');
  });

  it('should show when isOpen is true', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    // Check the property value
    expect(el.isOpen).to.be.true;
    
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.visibility).to.equal('visible');
    expect(computedStyle.opacity).to.equal('1');
  });

  it('should render title and message correctly', async () => {
    const title = 'Test Modal Title';
    const message = 'This is a test modal message';
    
    const el = await fixture(html`
      <app-modal 
        .isOpen=${true}
        .title=${title}
        .message=${message}>
      </app-modal>
    `);
    
    const titleElement = el.shadowRoot.querySelector('.modal-title');
    const messageElement = el.shadowRoot.querySelector('.modal-message');
    
    expect(titleElement.textContent.trim()).to.include(title);
    expect(messageElement.textContent.trim()).to.equal(message);
  });

  it('should display correct icon based on type', async () => {
    // Test danger type
    const dangerModal = await fixture(html`
      <app-modal .isOpen=${true} .type=${'danger'}></app-modal>
    `);
    
    const dangerIcon = dangerModal.shadowRoot.querySelector('.modal-icon');
    expect(dangerIcon.classList.contains('danger')).to.be.true;
    expect(dangerIcon.textContent.trim()).to.equal('!');
    
    // Test info type
    const infoModal = await fixture(html`
      <app-modal .isOpen=${true} .type=${'info'}></app-modal>
    `);
    
    const infoIcon = infoModal.shadowRoot.querySelector('.modal-icon');
    expect(infoIcon.classList.contains('info')).to.be.true;
    expect(infoIcon.textContent.trim()).to.equal('i');
    
    // Test success type
    const successModal = await fixture(html`
      <app-modal .isOpen=${true} .type=${'success'}></app-modal>
    `);
    
    const successIcon = successModal.shadowRoot.querySelector('.modal-icon');
    expect(successIcon.classList.contains('success')).to.be.true;
    expect(successIcon.textContent.trim()).to.equal('✓');
  });

  it('should dispatch modal-confirm event when confirm button is clicked', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    // Wait for component to render
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.btn.btn-primary');
    expect(confirmButton).to.exist;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('modal-confirm', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    confirmButton.click();
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
  });

  it('should dispatch modal-cancel event when cancel button is clicked', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    await el.updateComplete;
    
    const cancelButton = el.shadowRoot.querySelector('.btn.btn-secondary');
    expect(cancelButton).to.exist;
    
    let eventFired = false;
    
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    cancelButton.click();
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
  });

  it('should dispatch modal-cancel event when close button is clicked', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    await el.updateComplete;
    
    const closeButton = el.shadowRoot.querySelector('.close-button');
    expect(closeButton).to.exist;
    
    let eventFired = false;
    
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    closeButton.click();
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
  });

  it('should dispatch modal-cancel event when backdrop is clicked', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    await el.updateComplete;
    
    const backdrop = el.shadowRoot.querySelector('.modal-backdrop');
    expect(backdrop).to.exist;
    
    let eventFired = false;
    
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    backdrop.click();
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
  });

  it('should not dispatch cancel event when modal container is clicked', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    const modalContainer = el.shadowRoot.querySelector('.modal-container');
    modalContainer.click();
    
    // Wait a bit to ensure no event is fired
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(eventFired).to.be.false;
  });

  it('should show loading spinner when isLoading is true', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true} .isLoading=${true}></app-modal>`);
    
    await el.updateComplete;
    
    const loadingSpinner = el.shadowRoot.querySelector('.loading-spinner');
    expect(loadingSpinner).to.exist;
    
    // Buttons should be disabled when loading
    const confirmButton = el.shadowRoot.querySelector('.btn.btn-primary');
    const cancelButton = el.shadowRoot.querySelector('.btn.btn-secondary');
    const closeButton = el.shadowRoot.querySelector('.close-button');
    
    expect(confirmButton.disabled).to.be.true;
    expect(cancelButton.disabled).to.be.true;
    expect(closeButton.disabled).to.be.true;
  });

  it('should not dispatch events when buttons are disabled due to loading', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true} .isLoading=${true}></app-modal>`);
    
    await el.updateComplete;
    
    let confirmEventFired = false;
    let cancelEventFired = false;
    
    el.addEventListener('modal-confirm', () => {
      confirmEventFired = true;
    });
    
    el.addEventListener('modal-cancel', () => {
      cancelEventFired = true;
    });
    
    const confirmButton = el.shadowRoot.querySelector('.btn.btn-primary');
    const cancelButton = el.shadowRoot.querySelector('.btn.btn-secondary');
    
    confirmButton.click();
    cancelButton.click();
    
    // Wait a bit to ensure no events are fired
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(confirmEventFired).to.be.false;
    expect(cancelEventFired).to.be.false;
  });

  it('should use custom button texts when provided', async () => {
    const confirmText = 'Delete Now';
    const cancelText = 'Keep It';
    
    const el = await fixture(html`
      <app-modal 
        .isOpen=${true}
        .confirmText=${confirmText}
        .cancelText=${cancelText}>
      </app-modal>
    `);
    
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.btn.btn-primary');
    const cancelButton = el.shadowRoot.querySelector('.btn.btn-secondary');
    
    expect(confirmButton.textContent.trim()).to.include(confirmText);
    expect(cancelButton.textContent.trim()).to.include(cancelText);
  });

  it('should apply danger class to confirm button when type is danger', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true} .type=${'danger'}></app-modal>`);
    
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.btn.btn-danger');
    expect(confirmButton).to.exist;
    
    // Should not have btn-primary class
    const primaryButton = el.shadowRoot.querySelector('.btn.btn-primary');
    expect(primaryButton).to.be.null;
  });

  it('should handle ESC key to close modal', async () => {
    const el = await fixture(html`<app-modal .isOpen=${true}></app-modal>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    // Simulate ESC key press
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    el.dispatchEvent(escEvent);
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
  });

  it('should not handle ESC key when modal is not open', async () => {
    const el = await fixture(html`<app-modal .isOpen=${false}></app-modal>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    el.addEventListener('modal-cancel', () => {
      eventFired = true;
    });
    
    // Simulate ESC key press
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    el.dispatchEvent(escEvent);
    
    // Wait a bit to ensure no event is fired
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(eventFired).to.be.false;
  });
}); 