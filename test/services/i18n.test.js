import { expect } from '@open-wc/testing';
import { i18nService } from '../../src/i18n/i18n.service.js';

describe('I18nService', () => {
  beforeEach(() => {
    // Reset to default language before each test
    i18nService.currentLanguage = 'tr';
    i18nService.subscribers.clear();
  });

  describe('Initialization', () => {
    it('should have default language set', () => {
      expect(i18nService.currentLanguage).to.be.a('string');
      expect(['tr', 'en']).to.include(i18nService.currentLanguage);
    });

    it('should have translations loaded', () => {
      expect(i18nService.translations).to.exist;
      expect(i18nService.translations.tr).to.exist;
      expect(i18nService.translations.en).to.exist;
    });

    it('should initialize subscribers set', () => {
      expect(i18nService.subscribers).to.be.instanceOf(Set);
    });
  });

  describe('Translation (t method)', () => {
    it('should translate simple keys', () => {
      i18nService.currentLanguage = 'en';
      const translation = i18nService.t('common.search');
      expect(translation).to.equal('Search employees...');
    });

    it('should translate nested keys', () => {
      i18nService.currentLanguage = 'tr';
      const translation = i18nService.t('employee.firstName');
      expect(translation).to.equal('Ad');
    });

    it('should return English fallback for missing keys', () => {
      i18nService.currentLanguage = 'tr';
      // Check if pagination.page exists in Turkish, if not use a different key
      const translation = i18nService.t('pagination.page');
      // Since it might exist in Turkish as 'Sayfa', let's test with a key that definitely doesn't exist in TR
      const translation2 = i18nService.t('positions.junior');
      expect(translation2).to.equal('Junior'); // This should fallback to English
    });

    it('should return key as fallback when not found anywhere', () => {
      const translation = i18nService.t('nonexistent.key');
      expect(translation).to.equal('nonexistent.key');
    });

    it('should interpolate parameters correctly', () => {
      i18nService.currentLanguage = 'en';
      const translation = i18nService.t('validation.minLength', { min: 5 });
      expect(translation).to.include('5');
      expect(translation).to.include('characters');
    });

    it('should handle missing parameters in interpolation', () => {
      i18nService.currentLanguage = 'en';
      const translation = i18nService.t('validation.minLength', {});
      expect(translation).to.include('{min}'); // Should keep placeholder
    });
  });

  describe('Language Management', () => {
    it('should set language correctly', () => {
      i18nService.setLanguage('en');
      expect(i18nService.currentLanguage).to.equal('en');
    });

    it('should update document language attribute', () => {
      i18nService.setLanguage('en');
      expect(document.documentElement.lang).to.equal('en');
    });

    it('should ignore invalid languages', () => {
      const originalLang = i18nService.currentLanguage;
      i18nService.setLanguage('invalid');
      expect(i18nService.currentLanguage).to.equal(originalLang);
    });

    it('should get available languages', () => {
      const languages = i18nService.getAvailableLanguages();
      expect(languages).to.be.an('array');
      expect(languages).to.include('tr');
      expect(languages).to.include('en');
    });
  });

  describe('Key Validation', () => {
    it('should check if key exists', () => {
      expect(i18nService.hasKey('common.search')).to.be.true;
      expect(i18nService.hasKey('employee.firstName')).to.be.true;
      expect(i18nService.hasKey('nonexistent.key')).to.be.false;
    });

    it('should validate nested keys correctly', () => {
      expect(i18nService.hasKey('validation.required')).to.be.true;
      expect(i18nService.hasKey('departments.engineering')).to.be.true;
      expect(i18nService.hasKey('departments.nonexistent')).to.be.false;
    });
  });

  describe('Subscriber Management', () => {
    it('should subscribe components', () => {
      const mockComponent = { requestUpdate: () => {} };
      
      i18nService.subscribe(mockComponent);
      expect(i18nService.subscribers.has(mockComponent)).to.be.true;
    });

    it('should unsubscribe components', () => {
      const mockComponent = { requestUpdate: () => {} };
      
      i18nService.subscribe(mockComponent);
      i18nService.unsubscribe(mockComponent);
      expect(i18nService.subscribers.has(mockComponent)).to.be.false;
    });

    it('should notify subscribers when language changes', () => {
      let updateCalled = false;
      const mockComponent = { 
        requestUpdate: () => { updateCalled = true; }
      };
      
      i18nService.subscribe(mockComponent);
      i18nService.notifySubscribers();
      
      expect(updateCalled).to.be.true;
    });

    it('should handle subscribers without requestUpdate method', () => {
      const mockComponent = {}; // No requestUpdate method
      
      i18nService.subscribe(mockComponent);
      // Should not throw error
      expect(() => i18nService.notifySubscribers()).to.not.throw();
    });
  });

  describe('Language Change Events', () => {
    it('should respond to language-changed events', (done) => {
      const originalLang = i18nService.currentLanguage;
      
      // Set up event listener to verify change
      const checkLanguageChange = () => {
        expect(i18nService.currentLanguage).to.equal('en');
        done();
      };
      
      setTimeout(checkLanguageChange, 100);
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: 'en' }
      }));
    });
  });

  describe('Parameter Interpolation', () => {
    it('should handle multiple parameters', () => {
      // Create a test translation with multiple params
      const testStr = 'Hello {name}, you have {count} messages';
      const result = i18nService.interpolate(testStr, { name: 'John', count: 5 });
      
      expect(result).to.equal('Hello John, you have 5 messages');
    });

    it('should handle no parameters', () => {
      const testStr = 'Simple message';
      const result = i18nService.interpolate(testStr, {});
      
      expect(result).to.equal('Simple message');
    });

    it('should handle partial parameters', () => {
      const testStr = 'Hello {name}, you have {count} messages';
      const result = i18nService.interpolate(testStr, { name: 'John' });
      
      expect(result).to.include('Hello John');
      expect(result).to.include('{count}'); // Should keep unfilled placeholder
    });

    it('should handle special characters in parameters', () => {
      const testStr = 'Welcome {name}!';
      const result = i18nService.interpolate(testStr, { name: 'José María' });
      
      expect(result).to.equal('Welcome José María!');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty string keys', () => {
      const result = i18nService.t('');
      expect(result).to.equal('');
    });

    it('should handle malformed translation objects', () => {
      // Temporarily modify translations to test error handling
      const originalTranslations = i18nService.translations.tr;
      i18nService.translations.tr = null;
      
      const result = i18nService.t('common.search');
      // Should fallback to English or return key
      expect(result).to.be.a('string');
      
      // Restore original translations
      i18nService.translations.tr = originalTranslations;
    });

    it('should handle deeply nested missing keys', () => {
      const result = i18nService.t('very.deep.nested.nonexistent.key');
      expect(result).to.equal('very.deep.nested.nonexistent.key');
    });
  });

  describe('Performance', () => {
    it('should handle multiple rapid translations efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        i18nService.t('common.search');
        i18nService.t('employee.firstName');
        i18nService.t('validation.required');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 3000 translations in reasonable time (< 100ms)
      expect(duration).to.be.lessThan(100);
    });
  });
}); 