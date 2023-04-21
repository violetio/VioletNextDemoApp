import { combineReducers } from 'redux';
import cart from './cart';
import offers from './offers';

const rootReducer = combineReducers({
  cart,
  offers,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
