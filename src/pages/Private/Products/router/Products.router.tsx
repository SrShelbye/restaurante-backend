import { RouteObject } from 'react-router-dom';

import { PrivateRoutes } from '../../../models';
import { ProductsPage } from '../Products/Products.page';

export const ProductsRouter: RouteObject = {
  path: PrivateRoutes.PRODUCTS,
  element: <ProductsPage />
};
