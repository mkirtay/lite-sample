import { en } from './en.js';
import { tr } from './tr.js';

class I18nService {
  constructor() {
    this.currentLanguage = document.documentElement.lang || 'tr';
    this.translations = {
      en,
      tr
    };
    this.subscribers = new Set();

    // Listen for language changes
    window.addEventListener('language-changed', (e) => {
      console.log('🌐 Language changed to:', e.detail.language);
      this.currentLanguage = e.detail.language;
      this.notifySubscribers();
    });
  }

  // Add a component as subscriber
  subscribe(component) {
    this.subscribers.add(component);
  }

  // Remove a component from subscribers
  unsubscribe(component) {
    this.subscribers.delete(component);
  }

  // Notify all subscribed components to re-render
  notifySubscribers() {
    this.subscribers.forEach(component => {
      if (component.requestUpdate) {
        component.requestUpdate();
      }
    });
  }

  /**
   * Get translation for a key with optional parameters
   * @param {string} key - Translation key (e.g., 'employee.firstName')
   * @param {Object} params - Parameters to interpolate (e.g., {min: 2})
   * @returns {string} Translated text
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found
        translation = this.translations.en;
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            console.warn(`Translation key "${key}" not found in ${this.currentLanguage} or English`);
            return key; // Return key as fallback
          }
        }
        break;
      }
    }

    // If we got a string, interpolate parameters
    if (typeof translation === 'string') {
      return this.interpolate(translation, params);
    }

    console.warn(`Translation key "${key}" not found or is not a string`);
    return key;
  }

  /**
   * Interpolate parameters in translation string
   * @param {string} str - Translation string with placeholders
   * @param {Object} params - Parameters to interpolate
   * @returns {string} Interpolated string
   */
  interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Set current language
   * @param {string} language - Language code ('en' or 'tr')
   */
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      document.documentElement.lang = language;
    }
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get all available languages
   * @returns {Array} Array of language codes
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Check if a translation key exists
   * @param {string} key - Translation key
   * @returns {boolean} True if key exists
   */
  hasKey(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        return false;
      }
    }

    return typeof translation === 'string';
  }
}

// Create singleton instance
export const i18nService = new I18nService(); 