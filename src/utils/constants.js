// Application Constants
export const APP_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  LOCAL_STORAGE_KEY: 'employee_management_app',
  DEFAULT_LANGUAGE: 'en'
};

// Employee data constants
export const DEPARTMENTS = [
  'Analytics',
  'Tech'
];

export const POSITIONS = [
  'Junior',
  'Medior', 
  'Senior'
];

// View modes
export const VIEW_MODES = {
  TABLE: 'table',
  CARDS: 'cards'
};

// Routes
export const ROUTES = {
  EMPLOYEE_LIST: '/employees',
  EMPLOYEE_ADD: '/employees/add',
  EMPLOYEE_EDIT: '/employees/edit'
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  NAME: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD'
}; 