import { useNavigate, useRoutes } from 'react-router-dom';

import { useAppSelector, useMenu } from '../../hooks';

import { PrivateRouter } from './router';
import { SidebarProvider } from './Common/contexts/SidebarContext';

import { CircularProgress } from '@mui/material';
import { OrderProvider } from './Orders/context/Order.context';
import { useRestaurant } from './Restaurant/hooks/useRestaurant';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  useAllActiveCashRegisters,
  useCashRegisterActive
} from './Balance/hooks/useCashRegister';
import { ModalCreateCashRegister } from './Balance/components/ModalCreateCashRegister.component';
import {
  useActiveOrders,
  useOnOrderCreated,
  useOnOrderDeleted,
  useOnOrderUpdated
} from './Orders/hooks';
import { useProductionAreas } from './Restaurant/hooks/useProductionArea';
import { useTables } from './Tables/hooks/useTables';
import { useOnTableUpdated } from './Tables/hooks/useOnWebSocketsEventsTables';
import { selectAuth } from '@/redux';
import { useEffect } from 'react';

/* */
export const Private = () => {
  const content = useRoutes(PrivateRouter);

  // Load all menu
  const menuQuery = useMenu();

  // Load production areas
  const areasQuery = useProductionAreas();

  // Load active orders
  const { activeOrdersQuery } = useActiveOrders();

  // Load tables
  const { tablesQuery } = useTables();

  // Load cash register active
  // useCashRegisterActive();

  useAllActiveCashRegisters();

  // listener update table
  useOnTableUpdated();

  // const restaurantQuery = useRestaurant();

  const isLoading =
    activeOrdersQuery.isPending ||
    // restaurantQuery.isPending ||
    menuQuery.isPending ||
    areasQuery.isPending;
  // tablesQuery.isPending;

  // listener new order
  useOnOrderCreated();

  // listener update order
  useOnOrderUpdated();

  // listener delete order
  useOnOrderDeleted();

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <OrderProvider>
          <SidebarProvider>
            <>{content}</>
          </SidebarProvider>
        </OrderProvider>

        <ModalCreateCashRegister />
      </LocalizationProvider>
    </>
  );
};

export default Private;
