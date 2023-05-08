import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@violet/violet-js/interfaces/Order.interface';
import { OrderShippingMethod } from '@violet/violet-js/interfaces/OrderShippingMethod.interface';
import { hideCart, setCart, setShipping, showCart } from '../actions/cart';

export interface CartState {
  order?: Order;
  showCart: boolean;
}

const initialState: CartState = {
  order: undefined,
  showCart: false,
};

export default createReducer(initialState, (builder) => {
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
    .addCase(
      setShipping,
      (state: CartState, action: PayloadAction<OrderShippingMethod>) => {
        const bag = state.order?.bags.find(
          (curBag) => curBag.id === action.payload.bagId
        );
        if (bag) {
          bag.shippingMethod = action.payload;
          bag.total = bag.subTotal! + action.payload.price;
        }
      }
    );
});
