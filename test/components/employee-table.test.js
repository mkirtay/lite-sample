import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/employee-table/employee-table.js';

describe('EmployeeTable', () => {
  const mockEmployees = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+90 555 123 4567',
      department: 'Engineering',
      position: 'Senior Developer',
      hireDate: '2020-01-15',
      salary: '75000'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+90 555 234 5678',
      department: 'Marketing',
      position: 'Marketing Manager',
      hireDate: '2021-03-20',
      salary: '65000'
    }
  ];

  it('should render with default properties', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    expect(el).to.exist;
    expect(el.employees).to.deep.equal([]);
  });

  it('should render table structure', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    const table = el.shadowRoot.querySelector('table');
    const thead = el.shadowRoot.querySelector('thead');
    const tbody = el.shadowRoot.querySelector('tbody');
    
    expect(table).to.exist;
    expect(thead).to.exist;
    expect(tbody).to.exist;
  });

  it('should render correct table headers', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    const headers = el.shadowRoot.querySelectorAll('th');
    
    // Should have 10 headers (checkbox + 9 data columns)
    expect(headers.length).to.equal(10);
    
    // First header should be checkbox
    const checkboxHeader = headers[0];
    expect(checkboxHeader.classList.contains('checkbox-col')).to.be.true;
    
    const headerCheckbox = checkboxHeader.querySelector('input[type="checkbox"]');
    expect(headerCheckbox).to.exist;
  });

  it('should render empty table when no employees provided', async () => {
    const el = await fixture(html`<employee-table .employees=${[]}></employee-table>`);
    
    const tbody = el.shadowRoot.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    expect(rows.length).to.equal(0);
  });

  it('should render employee data in table rows', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    const tbody = el.shadowRoot.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    expect(rows.length).to.equal(2);
    
    // Check first row data
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    
    expect(cells[1].textContent.trim()).to.equal('John');  // firstName
    expect(cells[2].textContent.trim()).to.equal('Doe');   // lastName
    expect(cells[5].textContent.trim()).to.equal('+90 555 123 4567');  // phone
    expect(cells[6].textContent.trim()).to.equal('john.doe@company.com');  // email
  });

  it('should render action buttons for each employee', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    const editButtons = el.shadowRoot.querySelectorAll('.btn-edit');
    const deleteButtons = el.shadowRoot.querySelectorAll('.btn-delete');
    
    expect(editButtons.length).to.equal(2);
    expect(deleteButtons.length).to.equal(2);
    
    // Check button content
    expect(editButtons[0].textContent.trim()).to.equal('✏️');
    expect(deleteButtons[0].textContent.trim()).to.equal('🗑️');
  });

  it('should dispatch edit-employee event when edit button is clicked', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('edit-employee', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const editButton = el.shadowRoot.querySelector('.btn-edit');
    editButton.click();
    
    // Wait for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.employeeId).to.equal('1');
  });

  it('should dispatch delete-employee event when delete button is clicked', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('delete-employee', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const deleteButton = el.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();
    
    // Wait for event to fire
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.employeeId).to.equal('1');
  });

  it('should format dates correctly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    // Test formatDate method
    const formattedDate = el.formatDate('2020-01-15');
    expect(formattedDate).to.be.a('string');
    expect(formattedDate).to.include('15');
    expect(formattedDate).to.include('01');
    expect(formattedDate).to.include('2020');
  });

  it('should handle empty date in formatDate', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    expect(el.formatDate('')).to.equal('');
    expect(el.formatDate(null)).to.equal('');
    expect(el.formatDate(undefined)).to.equal('');
  });

  it('should format salary correctly', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    // Test formatSalary method
    const formattedSalary = el.formatSalary('75000');
    expect(formattedSalary).to.be.a('string');
    expect(formattedSalary).to.include('75');
    expect(formattedSalary).to.include('000');
  });

  it('should handle empty salary in formatSalary', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    expect(el.formatSalary('')).to.equal('');
    expect(el.formatSalary(null)).to.equal('');
    expect(el.formatSalary(undefined)).to.equal('');
  });

  it('should return correct department classes', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    expect(el.getDepartmentClass('Engineering')).to.equal('department-engineering');
    expect(el.getDepartmentClass('ENGINEERING')).to.equal('department-engineering');
    expect(el.getDepartmentClass('Marketing')).to.equal('department-marketing');
    expect(el.getDepartmentClass('Sales')).to.equal('department-sales');
    expect(el.getDepartmentClass('Analytics')).to.equal('department-analytics');
    expect(el.getDepartmentClass('Unknown')).to.equal('');
  });

  it('should return correct position classes', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    expect(el.getPositionClass('Junior')).to.equal('position-junior');
    expect(el.getPositionClass('JUNIOR')).to.equal('position-junior');
    expect(el.getPositionClass('Senior')).to.equal('position-senior');
    expect(el.getPositionClass('Manager')).to.equal('position-manager');
    expect(el.getPositionClass('Unknown')).to.equal('');
  });

  it('should render department and position badges with correct classes', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    const badges = el.shadowRoot.querySelectorAll('.position-badge');
    
    // Should have 2 badges per row (department + position) * 2 rows = 4 badges
    expect(badges.length).to.equal(4);
    
    // Check first row badges
    const firstRowBadges = Array.from(badges).slice(0, 2);
    expect(firstRowBadges[0].textContent.trim()).to.equal('Engineering');
    expect(firstRowBadges[1].textContent.trim()).to.equal('Senior Developer');
  });

  it('should render checkboxes for each row', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    const tbody = el.shadowRoot.querySelector('tbody');
    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
    
    expect(checkboxes.length).to.equal(2);
    
    checkboxes.forEach(checkbox => {
      expect(checkbox.classList.contains('checkbox')).to.be.true;
    });
  });

  it('should update table when employees prop changes', async () => {
    const el = await fixture(html`<employee-table .employees=${[]}></employee-table>`);
    
    await el.updateComplete;
    
    let rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(0);
    
    // Update employees
    el.employees = mockEmployees;
    await el.updateComplete;
    
    rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(2);
  });

  it('should handle single employee', async () => {
    const singleEmployee = [mockEmployees[0]];
    const el = await fixture(html`<employee-table .employees=${singleEmployee}></employee-table>`);
    
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    
    const editButtons = el.shadowRoot.querySelectorAll('.btn-edit');
    const deleteButtons = el.shadowRoot.querySelectorAll('.btn-delete');
    
    expect(editButtons.length).to.equal(1);
    expect(deleteButtons.length).to.equal(1);
  });

  it('should handle multiple edit and delete button clicks', async () => {
    const el = await fixture(html`<employee-table .employees=${mockEmployees}></employee-table>`);
    
    await el.updateComplete;
    
    const editEvents = [];
    const deleteEvents = [];
    
    el.addEventListener('edit-employee', (e) => {
      editEvents.push(e.detail.employeeId);
    });
    
    el.addEventListener('delete-employee', (e) => {
      deleteEvents.push(e.detail.employeeId);
    });
    
    const editButtons = el.shadowRoot.querySelectorAll('.btn-edit');
    const deleteButtons = el.shadowRoot.querySelectorAll('.btn-delete');
    
    // Click all edit buttons
    editButtons.forEach(btn => btn.click());
    
    // Click all delete buttons  
    deleteButtons.forEach(btn => btn.click());
    
    // Wait for events to fire
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(editEvents).to.deep.equal(['1', '2']);
    expect(deleteEvents).to.deep.equal(['1', '2']);
  });

  it('should have responsive design elements', async () => {
    const el = await fixture(html`<employee-table></employee-table>`);
    
    const tableContainer = el.shadowRoot.querySelector('.table-container');
    expect(tableContainer).to.exist;
    
    const computedStyle = getComputedStyle(tableContainer);
    expect(computedStyle.overflowX).to.equal('auto');
  });
}); 