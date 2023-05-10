import { OrderShippingMethodWrapper } from '@violet/violet-js/interfaces/OrderShippingMethodWrapper.interface';
import {
  BuildingStorefrontIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { OrderShippingMethod } from '@violet/violet-js/interfaces/OrderShippingMethod.interface';
import styles from './ShippingMethodWrapper.module.scss';
import CheckIcon from '@/public/svg/check.svg';
import { RootState } from '@/redux/reducers';
import { useAppSelector } from '@/redux/store';
import RadioButton from '@/components/RadioButton/RadioButton';

interface ShippingMethodProps {
  selectedMethod?: OrderShippingMethod;
  setSelectedMethod?: (value: OrderShippingMethod) => void;
  shippingMethod: OrderShippingMethod;
  style?: 'radio' | 'checkmark';
}

const ShippingMethod = ({
  selectedMethod,
  setSelectedMethod,
  shippingMethod,
  style = 'radio',
}: ShippingMethodProps) => {
  return (
    <div
      className={cx(styles.shippingMethod, {
        [styles.selected]:
          selectedMethod?.shippingMethodId === shippingMethod.shippingMethodId,
      })}
      onClick={() => setSelectedMethod?.(shippingMethod)}
    >
      <div className={styles.shippingMethodHeader}>
        {shippingMethod.label}
        {style === 'radio' ? (
          <RadioButton
            className={styles.radioButton}
            value={
              selectedMethod?.shippingMethodId ===
              shippingMethod.shippingMethodId
            }
          />
        ) : (
          <div
            className={cx(styles.checkmarkContainer, {
              [styles.selected]:
                selectedMethod?.shippingMethodId ===
                shippingMethod.shippingMethodId,
            })}
          >
            {selectedMethod?.shippingMethodId ===
              shippingMethod.shippingMethodId && (
              <CheckIcon className={styles.checkIcon} />
            )}
          </div>
        )}
      </div>
      <div className={styles.price}>
        {(shippingMethod.price / 100).toFixed(2)}
      </div>
    </div>
  );
};

interface ShippingMethodWrapperProps {
  shippingMethodWrapper: OrderShippingMethodWrapper;
  shouldExpand?: boolean;
  expandedStateChanged?: (expanded: boolean) => void;
  onChange?: (shippingMethodId: OrderShippingMethod) => void;
}

const ShippingMethodWrapper = ({
  shippingMethodWrapper,
  shouldExpand = false,
  expandedStateChanged,
  onChange,
}: ShippingMethodWrapperProps) => {
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [expanded, setExpanded] = useState(shouldExpand);
  const [selectedMethod, setSelectedMethod] = useState<OrderShippingMethod>();

  useEffect(() => {
    // Do not close this wrapper if it has been manually opened by the user.
    // See usage in ShippingMethodOptions for more details
    if (!expanded) {
      setExpanded(shouldExpand);
    }
  }, [shouldExpand, expanded]);

  const getBag = useCallback(
    (bagId: number) => {
      const foundBag = cartState?.order?.bags.find((bag) => bag.id === bagId);
      return foundBag;
    },
    [cartState?.order?.bags]
  );

  return (
    <div className={styles.bag}>
      <div
        className={cx(styles.bagHeader, {
          [styles.expanded]: expanded,
        })}
      >
        <BuildingStorefrontIcon className={styles.storeIcon} />
        {getBag(shippingMethodWrapper.bagId)?.merchantName}
        <div className={styles.itemCount}>
          {getBag(shippingMethodWrapper.bagId)?.skus?.reduce(
            (prevValue, sku) => prevValue + (sku.quantity || 0),
            0
          )}{' '}
          Item
        </div>
        <ChevronDownIcon
          className={cx(styles.chevronIcon, {
            [styles.flipped]: expanded,
          })}
          onClick={() => {
            setExpanded((prev) => {
              expandedStateChanged?.(!prev);
              return !prev;
            });
          }}
        />
      </div>
      {expanded && (
        <>
          {shippingMethodWrapper.shippingMethods.map((shippingMethod) => (
            <ShippingMethod
              key={shippingMethod.label}
              selectedMethod={selectedMethod}
              setSelectedMethod={(value) => {
                setExpanded(false);
                setSelectedMethod(value);
                onChange?.(value);
              }}
              shippingMethod={shippingMethod}
            />
          ))}
        </>
      )}
      {!expanded && selectedMethod && (
        <>
          <div className={styles.divider} />
          <ShippingMethod
            selectedMethod={selectedMethod}
            shippingMethod={selectedMethod}
            style="checkmark"
          />
        </>
      )}
    </div>
  );
};

export default ShippingMethodWrapper;
