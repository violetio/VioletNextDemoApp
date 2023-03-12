import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { reduxBatch } from "@manaflair/redux-batch";
import reducers from "./reducers";
import type { RootState } from "./reducers";

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [reduxBatch],
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
