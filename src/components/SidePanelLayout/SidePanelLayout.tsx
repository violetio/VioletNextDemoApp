import React from "react";
import cx from "classnames";
import { RootState } from "@/redux/reducers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import styles from "./SidePanelLayout.module.scss";
import ProductPanel from "../ProductPanel/ProductPanel";
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
  const selectedProduct = useAppSelector(
    (state: RootState) => state.products.selectedProduct
  );
  const cart = useAppSelector((state: RootState) => state.cart);

  return (
    <div className={styles.container}>
      <div className={styles.pageContent}>{children}</div>
      <div
        className={cx(styles.sidePanel, {
          [styles.active]: selectedProduct || cart.showCart,
        })}
      >
        <ClosePanelIcon
          className={styles.closePanel}
          onClick={() => dispatch(closeSidePanel())}
        />
        {selectedProduct && <ProductPanel product={selectedProduct} />}
        {cart.showCart && !selectedProduct && <CartPanel />}
      </div>
    </div>
  );
};

export default SidePanelLayout;
