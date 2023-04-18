import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { clearSelectedOffer, setSelectedOffer } from "../actions/offers";
import { Offer } from "@/interfaces/Offer.interface";

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
