import { createAsyncThunk } from '@reduxjs/toolkit';
import { hideCart } from '../actions/cart';

enum CommonThunkType {
  CLOSE_SIDE_PANEL = 'common/closeSidePanel',
}

// Remove
export const closeSidePanel = createAsyncThunk<void, void, any>(
  CommonThunkType.CLOSE_SIDE_PANEL,
  async (_, thunkApi) => {
    thunkApi.dispatch(hideCart());
  }
);
