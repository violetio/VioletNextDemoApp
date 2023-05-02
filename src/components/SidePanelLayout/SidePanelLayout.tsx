import React from 'react';
import cx from 'classnames';
import CartPanel from '../CartPanel/CartPanel';
import styles from './SidePanelLayout.module.scss';
import { RootState } from '@/redux/reducers';
import { useAppSelector } from '@/redux/store';
import AppHeader from '@/components/AppHeader/AppHeader';

interface Props {
  virtualizedScroll?: boolean;
  children: React.ReactNode;
}

/**
 * This is a layout including a sliding side panel to view a product or cart details
 */
const SidePanelLayout = ({ virtualizedScroll = false, children }: Props) => {
  const cart = useAppSelector((state: RootState) => state.cart);

  return (
    <div className={styles.container}>
      <AppHeader virtualizedScroll={virtualizedScroll} />
      <div className={styles.pageContent}>{children}</div>
      <div
        className={cx(styles.sidePanel, {
          [styles.active]: cart.showCart,
        })}
      >
        {cart.showCart && <CartPanel />}
      </div>
    </div>
  );
};

export default SidePanelLayout;
