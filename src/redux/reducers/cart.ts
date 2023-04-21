import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { hideCart, setCart, showCart } from '../actions/cart';
import { Order } from '@/interfaces/Order.interface';

export interface CartState {
  cart?: Order;
  showCart: boolean;
}

const initialState: CartState = {
  cart: undefined,
  showCart: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setCart, (state: CartState, action: PayloadAction<Order>) => {
      state.cart = action.payload;
    })
    .addCase(showCart, (state: CartState) => {
      state.showCart = true;
    })
    .addCase(hideCart, (state: CartState) => {
      state.showCart = false;
    })
);
