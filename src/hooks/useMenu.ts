import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMenu } from '../services';
import { Menu } from '../models';
import { useDispatch } from 'react-redux';
import { loadMenu } from '../redux';
import { useRestaurantStore } from '@/pages/Private/Common/store/restaurantStore';
import { queryKeys } from '@/api/query-keys';

/* */
export const useMenu = () => {
  const dispatch = useDispatch();
  const { restaurant } = useRestaurantStore();

  const menuQuery = useQuery<Menu>({
    queryKey: queryKeys.menu.detail(restaurant!.id),
    queryFn: () => getAllMenu(restaurant!.id)
  });

  // Handle Redux integration - dispatch on successful data fetch
  useEffect(() => {
    if (menuQuery.isSuccess && menuQuery.data) {
      dispatch(loadMenu(menuQuery.data));
    }
  }, [menuQuery.data, menuQuery.isSuccess, dispatch]);

  return menuQuery;
};
