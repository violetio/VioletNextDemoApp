import { Cart } from "@/interfaces/Cart.interface";
import { createAction } from "@reduxjs/toolkit";

enum ActionType {
  SET_CART = "SET_CART",
}

export const setCart = createAction<Cart>(ActionType.SET_CART);
