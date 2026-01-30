import { Outlet } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { ModalClientOrder } from './components';

import { ModalDeleteOrderDetail } from './components/modals/ModalDeleteOrderDetail.component';

import { ModalDeleteOrder } from './components/modals/ModalDeleteOrder.component';

/* */
export const Orders = () => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Outlet />

        <ModalClientOrder />
      </LocalizationProvider>

      <ModalDeleteOrder />
      <ModalDeleteOrderDetail />
    </>
  );
};

export default Orders;
