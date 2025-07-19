import { createSlice } from '@reduxjs/toolkit';
import { getBrowserLanguage } from '../utils/helpers.js';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    language: getBrowserLanguage(),
    currentRoute: '/employees',
    showModal: false,
    modalType: null, // 'add', 'edit', 'delete'
    modalData: null,
    isLoading: false,
    notifications: []
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      // Update HTML lang attribute
      document.documentElement.lang = action.payload;
    },
    
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    
    // Modal management
    showModal: (state, action) => {
      state.showModal = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    
    hideModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.modalData = null;
    },
    
    // Global loading state
    setGlobalLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || 'info', // 'success', 'error', 'warning', 'info'
        message: action.payload.message,
        timestamp: new Date().toISOString()
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const {
  setLanguage,
  setCurrentRoute,
  showModal,
  hideModal,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications
} = appSlice.actions;

export default appSlice.reducer; 