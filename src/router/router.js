import { Router } from '@vaadin/router';
import { ROUTES } from '../utils/constants.js';

export class AppRouter {
  constructor(outlet) {
    this.router = new Router(outlet);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.setRoutes([
      {
        path: '/',
        redirect: ROUTES.EMPLOYEE_LIST
      },
      {
        path: ROUTES.EMPLOYEE_LIST,
        component: 'employee-list-page',
        action: async () => {
          await import('../components/employee-list/employee-list-page.js');
        }
      },
      {
        path: ROUTES.EMPLOYEE_ADD,
        component: 'employee-form-page',
        action: async () => {
          await import('../components/employee-form/employee-form-page.js');
        }
      },
      {
        path: `${ROUTES.EMPLOYEE_EDIT}/:id`,
        component: 'employee-form-page',
        action: async () => {
          await import('../components/employee-form/employee-form-page.js');
        }
      },
      {
        path: '(.*)',
        redirect: ROUTES.EMPLOYEE_LIST
      }
    ]);
  }

  /**
   * Navigate to a specific route
   */
  navigate(path) {
    Router.go(path);
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return window.location.pathname;
  }
} 