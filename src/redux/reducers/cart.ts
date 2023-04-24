import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@violet/violet-js/interfaces/Order.interface';
import { hideCart, setCart, showCart } from '../actions/cart';

export interface CartState {
  order?: Order;
  showCart: boolean;
}

const initialState: CartState = {
  order: undefined,
  showCart: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setCart, (state: CartState, action: PayloadAction<Order>) => {
      state.order = action.payload;
    })
    .addCase(showCart, (state: CartState) => {
      state.showCart = true;
    })
    .addCase(hideCart, (state: CartState) => {
      state.showCart = false;
    })
);
