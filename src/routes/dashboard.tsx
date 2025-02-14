
import { createRoute } from '@tanstack/react-router';
import { DashboardPage } from '../pages/DashboardPage';
import { rootRoute } from './root';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});