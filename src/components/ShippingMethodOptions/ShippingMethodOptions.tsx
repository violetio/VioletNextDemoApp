import { useCallback, useEffect, useState } from 'react';
import {
  applyShippingMethodsToBags,
  fetchShippingOptions,
  OrderShippingMethodWrapper,
} from '@violet/violet-js';
import styles from './ShippingMethodOptions.module.scss';
import ShippingMethodWrapper from '@/components/ShippingMethodWrapper/ShippingMethodWrapper';
import { setCart } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';

interface ShippingMethodOptionsProps {
  setCurStep: (step: number) => void;
}

const ShippingMethodOptions = ({ setCurStep }: ShippingMethodOptionsProps) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const shippingAddress = cartState.order?.shippingAddress;
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<OrderShippingMethodWrapper[]>();
  /**
   * selectedShippingMethods mapping bagId to the shippingMethodId
   * ex: 
   * {
      [bagId]: [shippingMethodId]
      }
    */
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<{
    [key: string]: string;
  }>({});
  const [currentBag, setCurrentBag] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchShippingOptionsCallback = useCallback(async () => {
    if (cartState.order?.id) {
      const availableShippingData = await fetchShippingOptions(
        cartState.order.id.toString()
      );
      setAvailableShippingMethods(availableShippingData.data);
    }
  }, [cartState.order?.id]);

  const applyShipping = useCallback(async () => {
    if (cartState.order?.id) {
      try {
        setLoading(true);
        const response = await applyShippingMethodsToBags(
          cartState.order.id.toString(),
          Object.keys(selectedShippingMethods).map((bagId: string) => ({
            bagId: Number(bagId),
            shippingMethodId: selectedShippingMethods[bagId],
          }))
        );
        dispatch(setCart(response.data));
        setCurStep(2);
      } catch (err) {
        // Handle error thrown from attempt to apply shipping methods to bags
      }
      setLoading(false);
    }
  }, [cartState.order?.id, selectedShippingMethods, dispatch, setCurStep]);

  useEffect(() => {
    // Fetch available shipping methods
    fetchShippingOptionsCallback();
  }, [fetchShippingOptionsCallback]);

  if (!availableShippingMethods) {
    return (
      <div className={styles.spinner}>
        <Spinner diameter={100} strokeWidth={10} />
      </div>
    );
  }

  return (
    <div className={styles.shippingMethodStep}>
      <div className={styles.header}>
        Contact
        <Button
          className={styles.edit}
          type="button"
          label="Edit"
          onClick={() => setCurStep(0)}
        />
      </div>
      <div className={styles.contactContainer}>
        <div className={styles.header}>Email Address</div>
        {cartState?.order?.customer.email}
      </div>
      <div className={styles.contactContainer}>
        <div className={styles.header}>Shipping Address</div>
        <div>
          {cartState.order?.customer.firstName}{' '}
          {cartState.order?.customer.lastName}
        </div>
        <div>{shippingAddress?.address_1}</div>
        {shippingAddress?.address_2 && <div>{shippingAddress?.address_2}</div>}
        <div>
          {shippingAddress?.city}, {shippingAddress?.state}{' '}
          {shippingAddress?.postalCode}
        </div>
      </div>
      <div className={styles.shippingMethods}>
        <div className={styles.header}>Shipping Method</div>
        {availableShippingMethods &&
          availableShippingMethods.map((shippingMethodWrapper, index) => (
            <ShippingMethodWrapper
              key={shippingMethodWrapper.bagId}
              shippingMethodWrapper={shippingMethodWrapper}
              shouldExpand={index === currentBag}
              expandedStateChanged={(expanded) => {
                // Set the current bag when it is opened.
                if (expanded) {
                  setCurrentBag(index);
                } else {
                  // Set the selected bag index to an out of range number.
                  // No bag is selected when the wrapper is closed.
                  setCurrentBag(-1);
                }
              }}
              onChange={(shippingMethod) => {
                setSelectedShippingMethods((prev) => ({
                  ...prev,
                  // Replace the previous shipping method selected for this bag
                  [shippingMethod.bagId]: shippingMethod.shippingMethodId,
                }));
                /**
                 * Find the next bag that does not have a shipping method selected
                 * This is for the UX flow for expanding the next shipping wrapper
                 * when a shipping option is selected.
                 * */
                let newCurrentBagFound = false;
                for (
                  let i = index + 1;
                  i < availableShippingMethods.length;
                  i++
                ) {
                  const curBagId = availableShippingMethods[i].bagId;
                  if (!selectedShippingMethods[curBagId]) {
                    newCurrentBagFound = true;
                    setCurrentBag(i);
                    break;
                  }
                }
                if (!newCurrentBagFound) {
                  setCurrentBag(-1);
                }
              }}
            />
          ))}
        <Button
          className={styles.submit}
          label="Next"
          loading={loading}
          onClick={applyShipping}
        />
      </div>
    </div>
  );
};

export default ShippingMethodOptions;
