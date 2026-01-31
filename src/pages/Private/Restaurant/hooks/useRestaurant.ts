import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
// import { Restaurant } from "../models/restaurant.model";
import {
  getRestaurant,
  updateRestaurant
} from '../../Reports/services/rules.service';
import { UpdateRestaurantDto } from '../../Reports/dto/update-restaurant.dto';
import { Restaurant } from '../../Common/models/restaurant.model';
import { setRestaurant } from '@/redux/slices/restaurant'; // IMPORT ACTION
import {
  UpdateRestaurantLogoDto,
  updateRestaurantLogo,
  createRestaurant
} from '../services/restaurant.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { LoginResponseDto } from '@/models';
import { RestaurantService } from '../../Common/services/restaurant.service';
import { useDispatch } from 'react-redux';
import { onLogin } from '@/redux';
import { LoginResponse } from '@/models/dto/auth.dto';

/* */
export const switchRestaurantMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  return useMutation<LoginResponseDto, unknown, string>({
    mutationFn: (restaurantId: string) =>
      RestaurantService.switchRestaurant(restaurantId),
    onSuccess: (data: LoginResponseDto) => {
      dispatch(setRestaurant(data.currentRestaurant));
      dispatch(onLogin(data.user));
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', String(new Date().getTime()));
      dispatch(setRestaurant(data.currentRestaurant));
      window.location.reload();
    },
    onError: () => {
      enqueueSnackbar('Error al cambiar de restaurante', {
        variant: 'error'
      });
    }
  });
};

/* */
export const useRestaurant = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const restaurantQuery = useQuery<LoginResponse, unknown>({
    queryKey: ['restaurant'],
    queryFn: () => getRestaurant('1')
  });

  // Handle side effects - update Redux store on successful fetch
  useEffect(() => {
    if (restaurantQuery.isSuccess && restaurantQuery.data?.currentRestaurant) {
      dispatch(setRestaurant(restaurantQuery.data.currentRestaurant));
    }
  }, [restaurantQuery.data, restaurantQuery.isSuccess, dispatch]);

  useEffect(() => {
    if (restaurantQuery.isError) {
      enqueueSnackbar('Error al obtener el restaurante', {
        variant: 'error'
      });
    }
  }, [restaurantQuery.isError, enqueueSnackbar]);

  return restaurantQuery;
};

/* */
export const useUpdateRestaurant = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  return useMutation<Restaurant, unknown, UpdateRestaurantDto>({
    mutationFn: (data: UpdateRestaurantDto) => updateRestaurant('1', data),
    onSuccess: (data: Restaurant) => {
      dispatch(setRestaurant(data));
      enqueueSnackbar('Restaurante actualizado', { variant: 'success' });
    },
    onError: (error: unknown) => {
      console.log(error);
      enqueueSnackbar('Error al actualizar restaurante', {
        variant: 'error'
      });
    }
  });
};

/* */
export const useCreateRestaurant = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const switchRestaurant = switchRestaurantMutation();

  return useMutation<LoginResponse, unknown, CreateRestaurantDto>({
    mutationFn: (data: CreateRestaurantDto) => createRestaurant(data),
    onSuccess: (data: LoginResponse) => {
      if (data.currentRestaurant)
        switchRestaurant.mutate(data.currentRestaurant.id);
    },
    onError: (error: unknown) => {
      console.log(error);
      enqueueSnackbar('Error al crear el restaurante', {
        variant: 'error'
      });
    }
  });
};

/* */
export const useUpdateRestaurantLogo = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<Restaurant, unknown, UpdateRestaurantLogoDto>({
    mutationFn: (data: UpdateRestaurantLogoDto) =>
      updateRestaurantLogo(data.id, data),
    onSuccess: () => {
      enqueueSnackbar('Se actualizó correctamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('No se pudo actualizar la imagen', {
        variant: 'error'
      });
    }
  });
};
