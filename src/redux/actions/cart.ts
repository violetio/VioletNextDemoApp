import { Order } from "@/interfaces/Order.interface";
import { createAction } from "@reduxjs/toolkit";

enum CartActionType {
  SET_CART = "SET_CART",
  SHOW_CART = "SHOW_CART",
  HIDE_CART = "HIDE_CART",
}

export const setCart = createAction<Order>(CartActionType.SET_CART);
export const showCart = createAction(CartActionType.SHOW_CART);
export const hideCart = createAction(CartActionType.HIDE_CART);
