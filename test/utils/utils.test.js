import { expect } from '@open-wc/testing';

describe('Utility Functions', () => {
  
  describe('Date Utilities', () => {
    it('should format dates correctly', () => {
      const date = new Date('2020-01-15');
      const formatted = date.toLocaleDateString('tr-TR');
      
      expect(formatted).to.be.a('string');
      expect(formatted).to.include('15');
      expect(formatted).to.include('01');
      expect(formatted).to.include('2020');
    });
    
    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      expect(isNaN(invalidDate.getTime())).to.be.true;
    });
    
    it('should compare dates correctly', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(tomorrow > today).to.be.true;
    });
  });

  describe('Number Utilities', () => {
    it('should format currency correctly', () => {
      const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(75000);
      
      expect(formatted).to.be.a('string');
      expect(formatted).to.include('75');
    });
    
    it('should validate numeric input', () => {
      expect(isNaN('abc')).to.be.true;
      expect(isNaN('123')).to.be.false;
      expect(Number('123') > 0).to.be.true;
      expect(Number('-5') <= 0).to.be.true;
    });
  });

  describe('String Utilities', () => {
    it('should handle string trimming', () => {
      expect('  hello  '.trim()).to.equal('hello');
      expect(''.trim()).to.equal('');
      expect('   '.trim()).to.equal('');
    });
    
    it('should handle case conversion', () => {
      expect('Hello'.toLowerCase()).to.equal('hello');
      expect('hello'.toUpperCase()).to.equal('HELLO');
    });
    
    it('should validate string length', () => {
      expect('ab'.length >= 2).to.be.true;
      expect('a'.length < 2).to.be.true;
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('test@domain.com')).to.be.true;
      expect(emailRegex.test('invalid')).to.be.false;
      expect(emailRegex.test('invalid@')).to.be.false;
      expect(emailRegex.test('@domain.com')).to.be.false;
      expect(emailRegex.test('test@domain')).to.be.false;
    });
  });

  describe('Phone Validation', () => {
    it('should validate phone format', () => {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      
      expect(phoneRegex.test('+90 555 123 4567')).to.be.true;
      expect(phoneRegex.test('05551234567')).to.be.true;
      expect(phoneRegex.test('555-123-4567')).to.be.true;
      expect(phoneRegex.test('123')).to.be.false;
      expect(phoneRegex.test('abc123')).to.be.false;
    });
  });

  describe('Array Utilities', () => {
    it('should handle array operations', () => {
      const arr = [1, 2, 3];
      
      expect(arr.length).to.equal(3);
      expect(arr.includes(2)).to.be.true;
      expect(arr.includes(5)).to.be.false;
      
      const filtered = arr.filter(x => x > 1);
      expect(filtered.length).to.equal(2);
      
      const mapped = arr.map(x => x * 2);
      expect(mapped).to.deep.equal([2, 4, 6]);
    });
    
    it('should handle empty arrays', () => {
      const empty = [];
      expect(empty.length).to.equal(0);
      expect(empty.filter(x => x > 0)).to.deep.equal([]);
      expect(empty.map(x => x)).to.deep.equal([]);
    });
  });

  describe('Object Utilities', () => {
    it('should handle object operations', () => {
      const obj = { name: 'John', age: 30 };
      
      expect(Object.keys(obj)).to.deep.equal(['name', 'age']);
      expect(Object.values(obj)).to.deep.equal(['John', 30]);
      expect(obj.hasOwnProperty('name')).to.be.true;
      expect(obj.hasOwnProperty('email')).to.be.false;
    });
    
    it('should handle object spreading', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { ...obj1, c: 3 };
      
      expect(obj2).to.deep.equal({ a: 1, b: 2, c: 3 });
      expect(obj1).to.deep.equal({ a: 1, b: 2 }); // Original unchanged
    });
  });

  describe('Boolean Logic', () => {
    it('should handle boolean operations', () => {
      expect(true && true).to.be.true;
      expect(true && false).to.be.false;
      expect(false || true).to.be.true;
      expect(!true).to.be.false;
      expect(!!1).to.be.true;
      expect(!!0).to.be.false;
    });
    
    it('should handle truthy/falsy values', () => {
      expect(!!'hello').to.be.true;
      expect(!!'').to.be.false;
      expect(!!0).to.be.false;
      expect(!!null).to.be.false;
      expect(!!undefined).to.be.false;
    });
  });
}); 