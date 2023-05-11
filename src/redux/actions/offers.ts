import { createAction } from '@reduxjs/toolkit';
import { Offer } from '@violet/violet-js';

enum ProductActionType {
  SET_SELECTED_OFFER = 'SET_SELECTED_OFFER',
  CLEAR_SELECTED_OFFER = 'CLEAR_SELECTED_OFFER',
}

export const setSelectedOffer = createAction<Offer>(
  ProductActionType.SET_SELECTED_OFFER
);

export const clearSelectedOffer = createAction(
  ProductActionType.CLEAR_SELECTED_OFFER
);
