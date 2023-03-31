import { createAsyncThunk } from "@reduxjs/toolkit";
import { hideCart } from "../actions/cart";
import { clearSelectedProduct } from "../actions/products";

enum CommonThunkType {
  CLOSE_SIDE_PANEL = "common/closeSidePanel",
}

export const closeSidePanel = createAsyncThunk<void, void, any>(
  CommonThunkType.CLOSE_SIDE_PANEL,
  async (_, thunkApi) => {
    thunkApi.dispatch(clearSelectedProduct());
    thunkApi.dispatch(hideCart());
  }
);
