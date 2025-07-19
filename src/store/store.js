import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice.js';
import appReducer from './appSlice.js';
import { APP_CONSTANTS } from '../utils/constants.js';

// LocalStorage middleware for persistence
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save employee data to localStorage
  if (action.type.startsWith('employees/')) {
    const state = store.getState();
    try {
      localStorage.setItem(
        APP_CONSTANTS.LOCAL_STORAGE_KEY, 
        JSON.stringify(state.employees.list)
      );
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  return result;
};

// Load initial state from localStorage
const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem(APP_CONSTANTS.LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const employees = JSON.parse(serializedState);
    return {
      employees: {
        list: employees,
        searchTerm: '',
        selectedDepartment: '',
        currentPage: 1,
        viewMode: 'table',
        loading: false,
        error: null
      }
    };
  } catch (error) {
    console.error('Failed to load persisted state:', error);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    app: appReducer
  },
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(localStorageMiddleware)
}); 