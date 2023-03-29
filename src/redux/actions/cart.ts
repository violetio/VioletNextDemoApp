import { Cart } from "@/interfaces/Cart.interface";
import { createAction } from "@reduxjs/toolkit";

enum CartActionType {
  SET_CART = "SET_CART",
}

export const setCart = createAction<Cart>(CartActionType.SET_CART);
