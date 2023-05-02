import cx from 'classnames';
import { Bag } from '@violet/violet-js/interfaces/Bag.interface';
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';
import styles from './BagView.module.scss';
import ChevronDownIcon from '@/public/svg/chevron-down.svg';

interface Props {
  bag: Bag;
}

/**
 * A collapsible view of items in a bag
 */
const BagView = ({ bag }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const itemCount = useMemo(() => {
    return bag.skus?.reduce(
      (prevValue, sku) => prevValue + (sku.quantity || 0),
      0
    );
  }, [bag]);

  return (
    <div className={styles.bagView}>
      <div className={styles.header}>
        <BuildingStorefrontIcon className={styles.storeIcon} />
        <div className={styles.merchantName}>{bag.merchantName}</div>
        <div className={styles.itemCount}>{itemCount} Item</div>
        <ChevronDownIcon
          className={cx(styles.chevronIcon, { [styles.flipped]: expanded })}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </div>
      {expanded &&
        bag.skus?.map((sku, index) => (
          <div
            key={sku.id}
            className={cx(styles.sku, {
              [styles.lastIndex]: index === bag.skus?.length! - 1,
            })}
          >
            <img
              className={styles.skuImage}
              alt={sku.name}
              src={sku.thumbnail}
            />
            <div className={styles.skuInfo}>
              <div className={styles.name}> {sku.name}</div>
              <div className={styles.brand}>{sku.brand}</div>
              <div className={styles.quantityAndPrice}>
                <div className={styles.remove}>Remove</div>
                <div className={styles.quantity}>
                  Quantity: {sku.quantity}{' '}
                  <ChevronDownIcon className={cx(styles.chevronIcon)} />
                </div>
                <div className={styles.price}>
                  {((sku.price / 100) * (sku.quantity || 1)).toLocaleString(
                    'en-US',
                    {
                      style: 'currency',
                      currency: bag.currency,
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className={styles.bagTotal}>
        Bag Total
        <div className={styles.subtotal}>
          {(bag.subTotal! / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: bag.currency,
          })}
        </div>
      </div>
    </div>
  );
};

export default BagView;
