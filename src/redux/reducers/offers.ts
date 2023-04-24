import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '@violet/violet-js/interfaces/Offer.interface';
import { clearSelectedOffer, setSelectedOffer } from '../actions/offers';

export interface OfferState {
  selectedOffer?: Offer;
}

const initialState: OfferState = {
  selectedOffer: undefined,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      setSelectedOffer,
      (state: OfferState, action: PayloadAction<Offer>) => {
        state.selectedOffer = action.payload;
      }
    )
    .addCase(clearSelectedOffer, (state: OfferState) => {
      state.selectedOffer = undefined;
    })
);
