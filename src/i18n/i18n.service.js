import { en } from './en.js';
import { tr } from './tr.js';

class I18nService {
  constructor() {
    this.currentLanguage = document.documentElement.lang || 'tr';
    this.translations = {
      en,
      tr
    };

    // Listen for language changes
    window.addEventListener('language-changed', (e) => {
      this.currentLanguage = e.detail.language;
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
   * @param {string} text - Text with placeholders like {key}
   * @param {Object} params - Parameters to replace
   * @returns {string} Interpolated text
   */
  interpolate(text, params) {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      return params.hasOwnProperty(key) ? params[key] : match;
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
}

// Export singleton instance
export const i18nService = new I18nService(); 