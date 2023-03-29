import { Product } from "@/interfaces/Product.interface";
import { createAction } from "@reduxjs/toolkit";

enum ProductActionType {
  SET_SELECTED_PRODUCT = "SET_SELECTED_PRODUCT",
  CLEAR_SELECTED_PRODUCT = "CLEAR_SELECTED_PRODUCT",
}

export const setSelectedProduct = createAction<Product>(
  ProductActionType.SET_SELECTED_PRODUCT
);

export const clearSelectedProduct = createAction(
  ProductActionType.CLEAR_SELECTED_PRODUCT
);
