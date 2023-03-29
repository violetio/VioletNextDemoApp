import { combineReducers } from "redux";
import cart from "./cart";
import products from "./products";

const rootReducer = combineReducers({
  cart,
  products,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
