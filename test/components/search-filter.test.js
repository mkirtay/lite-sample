import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/search-filter/search-filter.js';

describe('SearchFilter', () => {
  it('should render with default properties', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    expect(el).to.exist;
    expect(el.searchTerm).to.equal('');
    expect(el.selectedDepartment).to.equal('');
  });

  it('should render search input and department select', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    
    expect(searchInput).to.exist;
    expect(departmentSelect).to.exist;
    expect(searchInput.type).to.equal('text');
    expect(departmentSelect.tagName.toLowerCase()).to.equal('select');
  });

  it('should have correct initial input values', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    
    expect(searchInput.value).to.equal('');
    expect(departmentSelect.value).to.equal('');
  });

  it('should display search term when property is set', async () => {
    const searchTerm = 'test search';
    const el = await fixture(html`<search-filter .searchTerm=${searchTerm}></search-filter>`);
    
    await el.updateComplete;
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    expect(searchInput.value).to.equal(searchTerm);
  });

  it('should display selected department when property is set', async () => {
    const department = 'Engineering';
    const el = await fixture(html`<search-filter .selectedDepartment=${department}></search-filter>`);
    
    await el.updateComplete;
    
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    expect(departmentSelect.value).to.equal(department);
  });

  it('should dispatch search-changed event when input value changes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('search-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    const testValue = 'test search term';
    
    // Simulate typing in the input
    searchInput.value = testValue;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.searchTerm).to.equal(testValue);
  });

  it('should dispatch filter-changed event when department selection changes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('filter-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    const testDepartment = 'Engineering';
    
    // Simulate selecting a department
    departmentSelect.value = testDepartment;
    departmentSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Wait a bit for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.department).to.equal(testDepartment);
  });

  it('should update component state when search input changes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    await el.updateComplete;
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    const testValue = 'new search';
    
    // Simulate typing in the input
    searchInput.value = testValue;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Wait for component to update
    await el.updateComplete;
    
    expect(el.searchTerm).to.equal(testValue);
  });

  it('should update component state when department selection changes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    await el.updateComplete;
    
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    const testDepartment = 'Marketing';
    
    // Simulate selecting a department
    departmentSelect.value = testDepartment;
    departmentSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Wait for component to update
    await el.updateComplete;
    
    expect(el.selectedDepartment).to.equal(testDepartment);
  });

  it('should have all department options in select', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    const options = departmentSelect.querySelectorAll('option');
    
    // Should have empty option + department options
    expect(options.length).to.be.greaterThan(1);
    
    // Check for specific departments
    const optionValues = Array.from(options).map(opt => opt.value);
    expect(optionValues).to.include('');  // empty option
    expect(optionValues).to.include('Engineering');
    expect(optionValues).to.include('Marketing');
    expect(optionValues).to.include('Sales');
    expect(optionValues).to.include('HR');
    expect(optionValues).to.include('Finance');
  });

  it('should clear search when input is emptied', async () => {
    const el = await fixture(html`<search-filter .searchTerm=${'initial search'}></search-filter>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('search-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    
    // Clear the input
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Wait for event and update
    await new Promise(resolve => setTimeout(resolve, 50));
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.searchTerm).to.equal('');
    expect(el.searchTerm).to.equal('');
  });

  it('should clear department filter when empty option is selected', async () => {
    const el = await fixture(html`<search-filter .selectedDepartment=${'Engineering'}></search-filter>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('filter-changed', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    
    // Select empty option
    departmentSelect.value = '';
    departmentSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Wait for event and update
    await new Promise(resolve => setTimeout(resolve, 50));
    await el.updateComplete;
    
    expect(eventFired).to.be.true;
    expect(eventDetail.department).to.equal('');
    expect(el.selectedDepartment).to.equal('');
  });

  it('should have proper input attributes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    
    expect(searchInput.type).to.equal('text');
    expect(searchInput.className).to.equal('search-input');
    expect(searchInput.placeholder).to.exist;
  });

  it('should have proper accessibility attributes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    const departmentSelect = el.shadowRoot.querySelector('.filter-select');
    
    // Basic accessibility checks
    expect(searchInput.tagName.toLowerCase()).to.equal('input');
    expect(departmentSelect.tagName.toLowerCase()).to.equal('select');
  });

  it('should handle multiple rapid input changes', async () => {
    const el = await fixture(html`<search-filter></search-filter>`);
    
    await el.updateComplete;
    
    const events = [];
    
    el.addEventListener('search-changed', (e) => {
      events.push(e.detail.searchTerm);
    });
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    
    // Simulate rapid typing
    const searchTerms = ['a', 'ab', 'abc', 'abcd'];
    
    for (const term of searchTerms) {
      searchInput.value = term;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Wait for all events to fire
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(events).to.have.length(4);
    expect(events).to.deep.equal(searchTerms);
    expect(el.searchTerm).to.equal('abcd');
  });
}); 