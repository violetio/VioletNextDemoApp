import {
  applyShippingMethodsToBags,
  fetchShippingOptions,
} from '@violet/violet-js/api/checkout/cart';
import { OrderShippingMethodWrapper } from '@violet/violet-js/interfaces/OrderShippingMethodWrapper.interface';
import { useCallback, useEffect, useState } from 'react';
import styles from './ShippingMethodOptions.module.scss';
import ShippingMethodWrapper from '@/components/ShippingMethodWrapper/ShippingMethodWrapper';
import { setCart, setShipping } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button/Button';

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
              isExpanded={index === currentBag}
              expandedStateChanged={(expanded) => {
                if (expanded) setCurrentBag(index);
              }}
              onChange={(shippingMethod) => {
                setSelectedShippingMethods((prev) => ({
                  ...prev,
                  // Replace the previous shipping method selected for this bag
                  [shippingMethod.bagId]: shippingMethod.shippingMethodId,
                }));
                dispatch(setShipping(shippingMethod));
                // Find the next bag that does not have a shipping method selected
                for (
                  let i = index + 1;
                  i < availableShippingMethods.length;
                  i++
                ) {
                  const curBagId = availableShippingMethods[i].bagId;
                  if (!selectedShippingMethods[curBagId]) {
                    setCurrentBag(i);
                    break;
                  }
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
