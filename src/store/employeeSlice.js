import { createSlice } from '@reduxjs/toolkit';
import { generateId } from '../utils/helpers.js';

// Sample names and data for generating realistic employees
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria', 'Christopher', 'Jennifer', 'William', 'Linda', 'Daniel', 'Elizabeth', 'Matthew', 'Barbara', 'Anthony', 'Susan', 'Mark', 'Jessica', 'Donald', 'Karen', 'Steven', 'Nancy', 'Paul', 'Betty', 'Andrew', 'Helen', 'Joshua', 'Sandra', 'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian', 'Ruth', 'George', 'Sharon', 'Timothy', 'Michelle', 'Ronald', 'Laura', 'Jason', 'Sarah', 'Edward', 'Kimberly', 'Jeffrey', 'Deborah'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const departments = ['Analytics', 'Tech'];
const positions = ['Junior', 'Mid', 'Senior'];

// Function to generate random date between two dates
const getRandomDate = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
};

// Function to generate random phone number
const getRandomPhone = () => {
  const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
  return `+90 5${randomNum.toString().slice(0, 2)} ${randomNum.toString().slice(2, 5)} ${randomNum.toString().slice(5, 9)}`;
};

// Generate 65 realistic employees
const generateEmployees = () => {
  return Array.from({ length: 65 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    return {
      id: (index + 1).toString(),
      firstName,
      lastName,
      dateOfEmployment: getRandomDate(2018, 2024),
      dateOfBirth: getRandomDate(1980, 2000),
      phone: getRandomPhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position
    };
  });
};

// Initial sample data - generated dynamically
const initialEmployees = generateEmployees();

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