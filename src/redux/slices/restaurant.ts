import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../pages/Private/Common/models/restaurant.model';

interface RestaurantState {
    restaurant: Restaurant | null;
    title: string;
}

const initialState: RestaurantState = {
    restaurant: null,
    title: 'Restaurant'
};

export const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
            state.restaurant = action.payload;
        },
        clearRestaurant: (state) => {
            state.restaurant = null;
        }
    }
});

export const { setRestaurant, clearRestaurant } = restaurantSlice.actions;
