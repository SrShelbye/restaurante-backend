import { RouteObject } from 'react-router-dom';

import { PrivateRoutes } from '../../../../models';
import { Products } from '../Products.page';

export const ProductsRouter: RouteObject = {
  path: PrivateRoutes.PRODUCTS,
  element: <Products />
};
