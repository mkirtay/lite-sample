import { en } from './en.js';
import { tr } from './tr.js';

const translations = {
  en,
  tr
};

/**
 * Get translation by key and language
 * @param {string} key - Translation key (e.g., 'nav.employees')
 * @param {string} language - Language code ('en' or 'tr')
 * @param {Object} params - Parameters for string interpolation
 * @returns {string} Translated text
 */
export const t = (key, language = 'en', params = {}) => {
  const keys = key.split('.');
  let translation = translations[language];
  
  // Navigate through nested keys
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k];
    } else {
      // Fallback to English if key not found
      translation = translations.en;
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return key if not found in any language
        }
      }
      break;
    }
  }
  
  // If final result is not a string, return the key
  if (typeof translation !== 'string') {
    return key;
  }
  
  // Replace parameters in the string
  let result = translation;
  Object.keys(params).forEach(param => {
    result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
  });
  
  return result;
};

/**
 * Get available languages
 */
export const getAvailableLanguages = () => {
  return Object.keys(translations);
};

/**
 * Check if language is supported
 */
export const isLanguageSupported = (language) => {
  return language in translations;
};

/**
 * Get current language from HTML lang attribute or browser
 */
export const getCurrentLanguage = () => {
  const htmlLang = document.documentElement.lang;
  if (htmlLang && isLanguageSupported(htmlLang)) {
    return htmlLang;
  }
  
  const browserLang = navigator.language.slice(0, 2);
  return isLanguageSupported(browserLang) ? browserLang : 'en';
}; 