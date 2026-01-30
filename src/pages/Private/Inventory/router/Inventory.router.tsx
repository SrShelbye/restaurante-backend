import { RouteObject } from 'react-router-dom';

import { PrivateRoutes } from '../../../../models';
import { Inventory } from '../Inventory.page';

export const InventoryRouter: RouteObject = {
  path: PrivateRoutes.INVENTORY,
  element: <Inventory />
};
