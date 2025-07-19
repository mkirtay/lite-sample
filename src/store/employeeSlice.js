import { createSlice } from '@reduxjs/toolkit';
import { generateId } from '../utils/helpers.js';

// Initial sample data
const initialEmployees = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    dateOfEmployment: '2022-01-15',
    dateOfBirth: '1990-05-10',
    phone: '+90 532 123 4567',
    email: 'ahmet.yilmaz@company.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    dateOfEmployment: '2021-06-10',
    dateOfBirth: '1988-12-03',
    phone: '+90 533 234 5678',
    email: 'ayse.kaya@company.com',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Demir',
    dateOfEmployment: '2020-03-20',
    dateOfBirth: '1985-08-15',
    phone: '+90 534 345 6789',
    email: 'mehmet.demir@company.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: '4',
    firstName: 'Fatma',
    lastName: 'Öztürk',
    dateOfEmployment: '2021-09-05',
    dateOfBirth: '1992-02-28',
    phone: '+90 535 456 7890',
    email: 'fatma.ozturk@company.com',
    department: 'Analytics',
    position: 'Junior'
  }
];

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: initialEmployees,
    searchTerm: '',
    selectedDepartment: '',
    currentPage: 1,
    viewMode: 'table', // 'table' or 'cards'
    loading: false,
    error: null
  },
  reducers: {
    // Employee CRUD operations
    addEmployee: (state, action) => {
      const newEmployee = {
        ...action.payload,
        id: generateId()
      };
      state.list.push(newEmployee);
    },
    
    updateEmployee: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.list.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };
      }
    },
    
    deleteEmployee: (state, action) => {
      state.list = state.list.filter(emp => emp.id !== action.payload);
    },
    
    // Filter and search
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    
    // Pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Loading and error states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSearchTerm,
  setSelectedDepartment,
  setCurrentPage,
  setViewMode,
  setLoading,
  setError,
  clearError
} = employeeSlice.actions;

export default employeeSlice.reducer; 