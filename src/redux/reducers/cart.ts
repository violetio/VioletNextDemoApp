import { Cart } from "@/interfaces/Cart.interface";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { hideCart, setCart, showCart } from "../actions/cart";

export interface CartState {
  cart?: Cart;
  showCart: boolean;
}

const initialState: CartState = {
  cart: undefined,
  showCart: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setCart, (state: CartState, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    })
    .addCase(showCart, (state: CartState) => {
      state.showCart = true;
    })
    .addCase(hideCart, (state: CartState) => {
      state.showCart = false;
    })
);
