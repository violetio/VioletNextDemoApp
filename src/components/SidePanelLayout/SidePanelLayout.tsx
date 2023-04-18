import React from "react";
import cx from "classnames";
import { RootState } from "@/redux/reducers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import styles from "./SidePanelLayout.module.scss";
import OfferPanel from "../OfferPanel/OfferPanel";
import ClosePanelIcon from "@/public/svg/close-panel.svg";
import { closeSidePanel } from "@/redux/thunks/common";
import CartPanel from "../CartPanel/CartPanel";

interface Props {
  children: React.ReactNode;
}

/**
 * This is a layout including a sliding side panel to view a product or cart details
 */
const SidePanelLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const selectedOffer = useAppSelector(
    (state: RootState) => state.offers.selectedOffer
  );
  const cart = useAppSelector((state: RootState) => state.cart);

  return (
    <div className={styles.container}>
      <div className={styles.pageContent}>{children}</div>
      <div
        className={cx(styles.sidePanel, {
          [styles.active]: selectedOffer || cart.showCart,
        })}
      >
        <ClosePanelIcon
          className={styles.closePanel}
          onClick={() => dispatch(closeSidePanel())}
        />
        {/* {selectedOffer && <OfferPanel offer={selectedOffer} />} */}
        {selectedOffer && <OfferPanel offer={selectedOffer} />}
        {cart.showCart && !selectedOffer && <CartPanel />}
      </div>
    </div>
  );
};

export default SidePanelLayout;
