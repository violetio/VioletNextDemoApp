import { Product } from "@/interfaces/Product.interface";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { clearSelectedProduct, setSelectedProduct } from "../actions/products";

export interface ProductState {
  selectedProduct?: Product;
}

const initialState: ProductState = {
  selectedProduct: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      setSelectedProduct,
      (state: ProductState, action: PayloadAction<Product>) => {
        state.selectedProduct = action.payload;
      }
    )
    .addCase(clearSelectedProduct, (state: ProductState) => {
      state.selectedProduct = undefined;
    })
);
