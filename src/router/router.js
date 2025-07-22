import { Router } from '@vaadin/router';

export const router = new Router();

// Preload not found page immediately
import('../components/not-found/not-found-page.js');

export function initializeRouter(outlet) {
  console.log('🚀 Router initializing with outlet:', outlet);
  
  if (!outlet) {
    console.error('❌ Router outlet not found!');
    return;
  }

  router.setOutlet(outlet);
  
  router.setRoutes([
    {
      path: '/',
      redirect: '/employees'
    },
    {
      path: '/employees',
      component: 'employee-list-page',
      action: async () => {
        console.log('📄 Loading employee list page...');
        await import('../components/employee-list/employee-list-page.js');
      }
    },
    {
      path: '/employees/add',
      component: 'employee-form-page', 
      action: async () => {
        console.log('📝 Loading add employee form...');
        await import('../components/employee-form/employee-form-page.js');
      }
    },
    {
      path: '/employees/edit/:id',
      component: 'employee-form-page',
      action: async () => {
        console.log('✏️ Loading edit employee form...');
        await import('../components/employee-form/employee-form-page.js');
      }
    },
    {
      path: '(.*)',
      component: 'not-found-page'
    }
  ]);

  console.log('✅ Router initialized successfully');
} 