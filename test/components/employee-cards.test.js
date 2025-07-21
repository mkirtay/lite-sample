import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/employee-cards/employee-cards.js';

describe('EmployeeCards', () => {
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
    const el = await fixture(html`<employee-cards></employee-cards>`);
    
    expect(el).to.exist;
    expect(el.employees).to.deep.equal([]);
  });

  it('should render empty when no employees', async () => {
    const el = await fixture(html`<employee-cards .employees=${[]}></employee-cards>`);
    
    const cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(0);
  });

  it('should render cards for employees', async () => {
    const el = await fixture(html`<employee-cards .employees=${mockEmployees}></employee-cards>`);
    
    await el.updateComplete;
    
    const cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(2);
  });

  it('should display employee information correctly', async () => {
    const el = await fixture(html`<employee-cards .employees=${mockEmployees}></employee-cards>`);
    
    await el.updateComplete;
    
    const firstCard = el.shadowRoot.querySelector('.employee-card');
    
    // Check name
    const name = firstCard.querySelector('.employee-name');
    expect(name.textContent.trim()).to.include('John Doe');
    
    // Check email
    const email = firstCard.querySelector('.info-text');
    expect(email.textContent.trim()).to.equal('john.doe@company.com');
  });

  it('should generate correct initials', async () => {
    const el = await fixture(html`<employee-cards .employees=${mockEmployees}></employee-cards>`);
    
    expect(el.getInitials('John', 'Doe')).to.equal('JD');
    expect(el.getInitials('jane', 'smith')).to.equal('JS');
    expect(el.getInitials('A', 'B')).to.equal('AB');
  });

  it('should dispatch edit-employee event', async () => {
    const el = await fixture(html`<employee-cards .employees=${mockEmployees}></employee-cards>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('edit-employee', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const editButton = el.shadowRoot.querySelector('.btn-edit');
    editButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail.employeeId).to.equal('1');
  });

  it('should dispatch delete-employee event', async () => {
    const el = await fixture(html`<employee-cards .employees=${mockEmployees}></employee-cards>`);
    
    await el.updateComplete;
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('delete-employee', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    const deleteButton = el.shadowRoot.querySelector('.btn-delete');
    deleteButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.true;
    expect(eventDetail.employeeId).to.equal('1');
  });

  it('should format dates correctly', async () => {
    const el = await fixture(html`<employee-cards></employee-cards>`);
    
    const formattedDate = el.formatDate('2020-01-15');
    expect(formattedDate).to.be.a('string');
    expect(formattedDate).to.include('15');
  });

  it('should format salary correctly', async () => {
    const el = await fixture(html`<employee-cards></employee-cards>`);
    
    const formattedSalary = el.formatSalary('75000');
    expect(formattedSalary).to.be.a('string');
    expect(formattedSalary).to.include('75');
  });

  it('should update when employees prop changes', async () => {
    const el = await fixture(html`<employee-cards .employees=${[]}></employee-cards>`);
    
    let cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(0);
    
    el.employees = mockEmployees;
    await el.updateComplete;
    
    cards = el.shadowRoot.querySelectorAll('.employee-card');
    expect(cards.length).to.equal(2);
  });
}); 