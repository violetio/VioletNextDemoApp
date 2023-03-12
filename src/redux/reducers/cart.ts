import { Cart } from "@/interfaces/Cart.interface";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { setCart } from "../actions/cart";

export interface AppState {}

const initialState: Partial<Cart> = {};

export default createReducer(initialState, (builder) =>
  builder.addCase(
    setCart,
    (state: AppState, action: PayloadAction<Cart>) => action.payload
  )
);
