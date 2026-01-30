import { RouteObject } from 'react-router-dom';

import { PrivateRoutes } from '../../../models';
import { InventoryPage } from '../Inventory/Inventory.page';

export const InventoryRouter: RouteObject = {
  path: PrivateRoutes.INVENTORY,
  element: <InventoryPage />
};
