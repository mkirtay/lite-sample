import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/employee-form/employee-form-page.js';

describe('EmployeeFormPage', () => {
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
    }
  ];

  it('should render with default properties', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    expect(el).to.exist;
    expect(el.employee).to.exist;
    expect(el.errors).to.deep.equal({});
    expect(el.isLoading).to.be.false;
    expect(el.isEditMode).to.be.false;
  });

  it('should validate required fields correctly', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Test firstName validation
    expect(el.validateField('firstName', '')).to.be.false;
    expect(el.errors.firstName).to.exist;
    
    expect(el.validateField('firstName', 'John')).to.be.true;
    expect(el.errors.firstName).to.be.undefined;
    
    // Test lastName validation
    expect(el.validateField('lastName', '')).to.be.false;
    expect(el.errors.lastName).to.exist;
    
    expect(el.validateField('lastName', 'Doe')).to.be.true;
    expect(el.errors.lastName).to.be.undefined;
  });

  it('should validate minimum length for names', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Test minimum length validation
    expect(el.validateField('firstName', 'J')).to.be.false;
    expect(el.errors.firstName).to.exist;
    
    expect(el.validateField('firstName', 'Jo')).to.be.true;
    expect(el.errors.firstName).to.be.undefined;
    
    expect(el.validateField('lastName', 'D')).to.be.false;
    expect(el.errors.lastName).to.exist;
    
    expect(el.validateField('lastName', 'Do')).to.be.true;
    expect(el.errors.lastName).to.be.undefined;
  });

  it('should validate email format correctly', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Invalid email formats
    expect(el.validateField('email', 'invalid')).to.be.false;
    expect(el.errors.email).to.exist;
    
    expect(el.validateField('email', 'invalid@')).to.be.false;
    expect(el.errors.email).to.exist;
    
    expect(el.validateField('email', 'invalid@domain')).to.be.false;
    expect(el.errors.email).to.exist;
    
    expect(el.validateField('email', '@domain.com')).to.be.false;
    expect(el.errors.email).to.exist;
    
    // Valid email format
    expect(el.validateField('email', 'test@domain.com')).to.be.true;
    expect(el.errors.email).to.be.undefined;
  });

  it('should detect duplicate emails', async () => {
    const el = await fixture(html`<employee-form-page .employees=${mockEmployees}></employee-form-page>`);
    
    // Test duplicate email detection
    expect(el.validateField('email', 'john.doe@company.com')).to.be.false;
    expect(el.errors.email).to.exist;
    
    // Test case insensitive duplicate detection
    expect(el.validateField('email', 'JOHN.DOE@COMPANY.COM')).to.be.false;
    expect(el.errors.email).to.exist;
    
    // Test non-duplicate email
    expect(el.validateField('email', 'jane.doe@company.com')).to.be.true;
    expect(el.errors.email).to.be.undefined;
  });

  it('should allow existing email in edit mode', async () => {
    const el = await fixture(html`<employee-form-page .employees=${mockEmployees} .employeeId=${'1'}></employee-form-page>`);
    
    // Should allow the same email for the employee being edited
    expect(el.validateField('email', 'john.doe@company.com')).to.be.true;
    expect(el.errors.email).to.be.undefined;
  });

  it('should validate phone number format', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Invalid phone formats
    expect(el.validateField('phone', '123')).to.be.false;
    expect(el.errors.phone).to.exist;
    
    expect(el.validateField('phone', 'abc123')).to.be.false;
    expect(el.errors.phone).to.exist;
    
    // Valid phone formats
    expect(el.validateField('phone', '+90 555 123 4567')).to.be.true;
    expect(el.errors.phone).to.be.undefined;
    
    expect(el.validateField('phone', '05551234567')).to.be.true;
    expect(el.errors.phone).to.be.undefined;
    
    expect(el.validateField('phone', '555-123-4567')).to.be.true;
    expect(el.errors.phone).to.be.undefined;
  });

  it('should validate hire date', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Empty date
    expect(el.validateField('hireDate', '')).to.be.false;
    expect(el.errors.hireDate).to.exist;
    
    // Future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(el.validateField('hireDate', futureDate.toISOString().split('T')[0])).to.be.false;
    expect(el.errors.hireDate).to.exist;
    
    // Valid past date
    expect(el.validateField('hireDate', '2020-01-15')).to.be.true;
    expect(el.errors.hireDate).to.be.undefined;
    
    // Today's date
    const today = new Date().toISOString().split('T')[0];
    expect(el.validateField('hireDate', today)).to.be.true;
    expect(el.errors.hireDate).to.be.undefined;
  });

  it('should validate salary', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Invalid salary values
    expect(el.validateField('salary', '')).to.be.false;
    expect(el.errors.salary).to.exist;
    
    expect(el.validateField('salary', '0')).to.be.false;
    expect(el.errors.salary).to.exist;
    
    expect(el.validateField('salary', '-1000')).to.be.false;
    expect(el.errors.salary).to.exist;
    
    expect(el.validateField('salary', 'abc')).to.be.false;
    expect(el.errors.salary).to.exist;
    
    // Valid salary values
    expect(el.validateField('salary', '50000')).to.be.true;
    expect(el.errors.salary).to.be.undefined;
    
    expect(el.validateField('salary', '75000.50')).to.be.true;
    expect(el.errors.salary).to.be.undefined;
  });

  it('should validate department and position', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Empty values
    expect(el.validateField('department', '')).to.be.false;
    expect(el.errors.department).to.exist;
    
    expect(el.validateField('position', '')).to.be.false;
    expect(el.errors.position).to.exist;
    
    // Valid values
    expect(el.validateField('department', 'Engineering')).to.be.true;
    expect(el.errors.department).to.be.undefined;
    
    expect(el.validateField('position', 'Developer')).to.be.true;
    expect(el.errors.position).to.be.undefined;
  });

  it('should validate entire form', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Empty form should be invalid
    expect(el.validateForm()).to.be.false;
    expect(Object.keys(el.errors)).to.have.length.greaterThan(0);
    
    // Set valid employee data
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 555 123 4567',
      department: 'Engineering',
      position: 'Developer',
      hireDate: '2020-01-15',
      salary: '50000'
    };
    
    expect(el.validateForm()).to.be.true;
    expect(Object.keys(el.errors)).to.have.length(0);
  });

  it('should handle input changes and trigger validation', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    await el.updateComplete;
    
    const mockEvent = {
      target: {
        name: 'firstName',
        value: 'John'
      }
    };
    
    el.handleInputChange(mockEvent);
    
    expect(el.employee.firstName).to.equal('John');
    expect(el.errors.firstName).to.be.undefined;
  });

  it('should handle input changes with invalid data', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    const mockEvent = {
      target: {
        name: 'email',
        value: 'invalid-email'
      }
    };
    
    el.handleInputChange(mockEvent);
    
    expect(el.employee.email).to.equal('invalid-email');
    expect(el.errors.email).to.exist;
  });

  it('should prevent form submission when validation fails', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    const mockEvent = {
      preventDefault: () => {}
    };
    
    let preventDefaultCalled = false;
    mockEvent.preventDefault = () => {
      preventDefaultCalled = true;
    };
    
    // Should not show modal when validation fails
    el.handleSubmit(mockEvent);
    
    expect(el.showConfirmModal).to.be.false;
  });

  it('should show confirmation modal when validation passes', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Set valid employee data
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 555 123 4567',
      department: 'Engineering',
      position: 'Developer',
      hireDate: '2020-01-15',
      salary: '50000'
    };
    
    const mockEvent = {
      preventDefault: () => {}
    };
    
    el.handleSubmit(mockEvent);
    
    expect(el.showConfirmModal).to.be.true;
  });

  it('should handle save confirmation', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    el.showConfirmModal = true;
    el.handleConfirmSave();
    
    expect(el.showConfirmModal).to.be.false;
    expect(el.isLoading).to.be.true;
  });

  it('should handle save cancellation', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    el.showConfirmModal = true;
    el.handleCancelSave();
    
    expect(el.showConfirmModal).to.be.false;
  });

  it('should clear specific field error when field becomes valid', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // First make field invalid
    el.validateField('firstName', '');
    expect(el.errors.firstName).to.exist;
    
    // Then make it valid
    el.validateField('firstName', 'John');
    expect(el.errors.firstName).to.be.undefined;
    
    // Other errors should remain if they exist
    el.validateField('lastName', '');
    expect(el.errors.lastName).to.exist;
    expect(el.errors.firstName).to.be.undefined;
  });

  it('should handle whitespace in text fields', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    
    // Whitespace-only should be invalid
    expect(el.validateField('firstName', '   ')).to.be.false;
    expect(el.errors.firstName).to.exist;
    
    // Text with whitespace should be valid
    expect(el.validateField('firstName', ' John ')).to.be.true;
    expect(el.errors.firstName).to.be.undefined;
  });

  it('should handle email case sensitivity in duplicate check', async () => {
    const el = await fixture(html`<employee-form-page .employees=${mockEmployees}></employee-form-page>`);
    
    // Test case insensitive duplicate detection
    expect(el.isEmailDuplicate('JOHN.DOE@COMPANY.COM')).to.be.true;
    expect(el.isEmailDuplicate('john.doe@COMPANY.COM')).to.be.true;
    expect(el.isEmailDuplicate('John.Doe@Company.Com')).to.be.true;
    
    // Test non-duplicate
    expect(el.isEmailDuplicate('jane.doe@company.com')).to.be.false;
  });
}); 