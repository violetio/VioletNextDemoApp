import { createAction } from '@reduxjs/toolkit';
import { Order } from '@violet/violet-js/interfaces/Order.interface';
import { OrderShippingMethod } from '@violet/violet-js/interfaces/OrderShippingMethod.interface';

enum CartActionType {
  SET_CART = 'SET_CART',
  SHOW_CART = 'SHOW_CART',
  HIDE_CART = 'HIDE_CART',
  SET_SHIPPING = 'SET_SHIPPING',
  CLEAR_CART = 'CLEAR_CART',
}

export const setCart = createAction<Order>(CartActionType.SET_CART);
export const showCart = createAction(CartActionType.SHOW_CART);
export const hideCart = createAction(CartActionType.HIDE_CART);
export const clearCart = createAction(CartActionType.CLEAR_CART);
export const setShipping = createAction<OrderShippingMethod>(
  CartActionType.SET_SHIPPING
);
