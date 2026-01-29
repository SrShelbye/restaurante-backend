import React from 'react';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { selectAuth } from '../redux/slices/auth';
import { useAppSelector } from '../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { onLogin } from '../redux/slices/auth';
import { IUser, IRole, RestaurantRole } from '../models';

import { Public } from '../pages/Public/Public.page';
import { SetupRestaurant } from '@/pages/Private/SetupRestaurant';
import { useRestaurantStore } from '@/pages/Private/Common/store/restaurantStore';
import { useRenewToken } from '@/pages/Public/Auth/hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

const Private = lazy(() => import('../pages/Private/Private'));

/**
 * @author Santiago Quirumbay
 * @version v1.1 12-04-2025 Implement useRenewToken hook
 */
export const AppRouter = () => {
  const { status } = useAppSelector(selectAuth);
  const { restaurant } = useRestaurantStore((state) => state);
  const dispatch = useDispatch();
  
  // Demo mode - Auto login for demo purposes
  React.useEffect(() => {
    if (status === 'not-authenticated') {
      const demoRole: IRole = {
        id: 1,
        name: 'Administrador',
        description: 'Administrador del sistema'
      };
      
      const demoRestaurantRole: RestaurantRole = {
        id: 1,
        restaurant: {
          id: 'demo-restaurant-001',
          name: 'Restaurante Demo',
          logo: '',
          address: 'Dirección Demo',
          capacity: 50,
          identification: '',
          phone: '',
          email: '',
          percentageAttendance: 75,
          simulationEndDate: '',
          simulationStartDate: '',
          lastSimulationUpdate: '',
          lastPredictionUpdate: Date.now()
        },
        role: demoRole
      };
      
      const demoUser: IUser = {
        id: 'demo-admin-001',
        username: 'admin',
        person: {
          id: 'person-001',
          firstName: 'Administrador',
          lastName: 'Demo',
          email: 'admin@demo.com',
          numPhone: '+123456789'
        },
        online: true,
        restaurantRoles: [demoRestaurantRole],
        isActive: true,
        role: demoRole
      };
      dispatch(onLogin(demoUser));
    }
  }, [status, dispatch]);

  useRenewToken();

  if (status === 'checking') {
    return (
      <Box>
        <CircularProgress />
        <Typography>checking status</Typography>
      </Box>
    );
  }

  return (
    <Routes>
      {status === 'not-authenticated' ? (
        <Route path='/*' element={<Public />} />
      ) : status === 'authenticated' && !restaurant ? (
        <Route path='/*' element={<SetupRestaurant />} />
      ) : (
        <Route path='/*' element={<Private key={restaurant?.id} />} />
      )}
    </Routes>
  );
};
