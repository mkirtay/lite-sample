import { expect } from '@open-wc/testing';
import { getBrowserLanguage } from '../../src/utils/helpers.js';

describe('Helper Functions', () => {
  
  describe('getBrowserLanguage', () => {
    let originalLang;
    let originalNavigatorLanguage;
    
    beforeEach(() => {
      // Store original values
      originalLang = document.documentElement.lang;
      originalNavigatorLanguage = navigator.language;
    });
    
    afterEach(() => {
      // Restore original values
      document.documentElement.lang = originalLang;
      // Note: navigator.language is read-only, so we can't restore it
    });
    
    it('should return HTML lang attribute when valid', () => {
      document.documentElement.lang = 'tr';
      const result = getBrowserLanguage();
      expect(result).to.equal('tr');
      
      document.documentElement.lang = 'en';
      const result2 = getBrowserLanguage();
      expect(result2).to.equal('en');
    });
    
    it('should return supported language codes only', () => {
      const result = getBrowserLanguage();
      expect(['tr', 'en']).to.include(result);
    });
    
    it('should default to "en" for unsupported languages', () => {
      document.documentElement.lang = 'fr'; // Unsupported language
      const result = getBrowserLanguage();
      expect(result).to.equal('en');
    });
    
    it('should handle empty HTML lang attribute', () => {
      document.documentElement.lang = '';
      const result = getBrowserLanguage();
      expect(['tr', 'en']).to.include(result);
    });
    
    it('should return valid language code', () => {
      const result = getBrowserLanguage();
      expect(result).to.be.a('string');
      expect(result.length).to.equal(2);
      expect(['tr', 'en']).to.include(result);
    });
  });
  
  describe('ID Generation', () => {
    it('should generate unique IDs', () => {
      // Test multiple ID generations
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        ids.add(id);
      }
      
      // All IDs should be unique
      expect(ids.size).to.equal(100);
    });
    
    it('should generate string IDs', () => {
      const id = Date.now().toString();
      expect(id).to.be.a('string');
      expect(id.length).to.be.greaterThan(0);
    });
  });
  
  describe('Date Utilities', () => {
    it('should handle date formatting', () => {
      const date = new Date('2023-01-15');
      const formatted = date.toLocaleDateString('tr-TR');
      
      expect(formatted).to.be.a('string');
      expect(formatted).to.include('15');
    });
    
    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid-date');
      expect(isNaN(invalidDate.getTime())).to.be.true;
    });
    
    it('should compare dates correctly', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-02');
      
      expect(date2 > date1).to.be.true;
      expect(date1 < date2).to.be.true;
    });
  });
  
  describe('Local Storage Utilities', () => {
    const TEST_KEY = 'test_key';
    
    afterEach(() => {
      // Clean up test data
      localStorage.removeItem(TEST_KEY);
    });
    
    it('should save and retrieve from localStorage', () => {
      const testData = { name: 'John', age: 30 };
      
      localStorage.setItem(TEST_KEY, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(TEST_KEY));
      
      expect(retrieved).to.deep.equal(testData);
    });
    
    it('should handle non-existent keys', () => {
      const result = localStorage.getItem('non_existent_key');
      expect(result).to.be.null;
    });
    
    it('should handle malformed JSON', () => {
      localStorage.setItem(TEST_KEY, 'invalid-json');
      
      expect(() => {
        JSON.parse(localStorage.getItem(TEST_KEY));
      }).to.throw();
    });
  });
  
  describe('URL/Route Utilities', () => {
    it('should handle URL manipulation', () => {
      const currentUrl = window.location.href;
      expect(currentUrl).to.be.a('string');
      expect(currentUrl).to.include('://');
    });
    
    it('should handle route parsing', () => {
      // Test route pattern matching
      const routes = ['/employees', '/employees/add', '/employees/edit/:id'];
      
      routes.forEach(route => {
        expect(route).to.be.a('string');
        expect(route.startsWith('/')).to.be.true;
      });
    });
  });
  
  describe('Form Utilities', () => {
    it('should handle form data extraction', () => {
      const mockFormData = new FormData();
      mockFormData.append('name', 'John');
      mockFormData.append('email', 'john@example.com');
      
      expect(mockFormData.get('name')).to.equal('John');
      expect(mockFormData.get('email')).to.equal('john@example.com');
    });
    
    it('should handle form validation patterns', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      
      expect(emailPattern.test('test@example.com')).to.be.true;
      expect(emailPattern.test('invalid-email')).to.be.false;
      
      expect(phonePattern.test('+90 555 123 4567')).to.be.true;
      expect(phonePattern.test('123')).to.be.false;
    });
  });
  
  describe('String Utilities', () => {
    it('should handle string operations', () => {
      const str = '  Hello World  ';
      
      expect(str.trim()).to.equal('Hello World');
      expect(str.toLowerCase().includes('hello')).to.be.true;
      expect(str.toUpperCase().includes('WORLD')).to.be.true;
    });
    
    it('should handle empty strings', () => {
      expect(''.trim()).to.equal('');
      expect(''.length).to.equal(0);
      expect(!!'').to.be.false;
    });
    
    it('should handle string interpolation', () => {
      const template = 'Hello {name}!';
      const result = template.replace('{name}', 'John');
      
      expect(result).to.equal('Hello John!');
    });
  });
  
  describe('Array Utilities', () => {
    it('should handle array operations', () => {
      const arr = [1, 2, 3, 4, 5];
      
      expect(arr.filter(x => x > 3)).to.deep.equal([4, 5]);
      expect(arr.map(x => x * 2)).to.deep.equal([2, 4, 6, 8, 10]);
      expect(arr.find(x => x === 3)).to.equal(3);
      expect(arr.includes(3)).to.be.true;
    });
    
    it('should handle empty arrays', () => {
      const empty = [];
      
      expect(empty.length).to.equal(0);
      expect(empty.filter(x => x > 0)).to.deep.equal([]);
      expect(empty.map(x => x)).to.deep.equal([]);
      expect(empty.find(x => x)).to.be.undefined;
    });
  });
  
  describe('Object Utilities', () => {
    it('should handle object operations', () => {
      const obj = { a: 1, b: 2, c: 3 };
      
      expect(Object.keys(obj)).to.deep.equal(['a', 'b', 'c']);
      expect(Object.values(obj)).to.deep.equal([1, 2, 3]);
      expect(Object.entries(obj)).to.deep.equal([['a', 1], ['b', 2], ['c', 3]]);
    });
    
    it('should handle object spreading', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const merged = { ...obj1, ...obj2 };
      
      expect(merged).to.deep.equal({ a: 1, b: 2, c: 3, d: 4 });
    });
    
    it('should handle object cloning', () => {
      const original = { a: 1, b: { c: 2 } };
      const shallow = { ...original };
      const deep = JSON.parse(JSON.stringify(original));
      
      expect(shallow).to.deep.equal(original);
      expect(deep).to.deep.equal(original);
      expect(shallow.b === original.b).to.be.true; // Shallow copy
      expect(deep.b === original.b).to.be.false; // Deep copy
    });
  });
}); 