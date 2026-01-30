import { RouteObject } from 'react-router-dom';

import { PrivateRoutes } from '../../../../models';
import { ErpDashboard } from '../ErpDashboard.page';

export const DashboardRouter: RouteObject = {
  path: PrivateRoutes.DASHBOARD,
  element: <ErpDashboard />
};
