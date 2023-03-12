import cx from "classnames";
import axios from "axios";
import useSWR from "swr";
import styles from "./ProductPage.module.scss";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { Sku } from "@/interfaces/Sku.interface";
import { Variant } from "@/interfaces/Variant.interface";
import { useAppDispatch } from "@/redux/store";
import { setCart } from "@/redux/actions/cart";

export default function ProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { productId } = router.query;
  const queryUrl = productId ? `/api/catalog/products/${productId}` : null;
  const { data } = useSWR(
    queryUrl,
    async (url) =>
      (
        await axios.get(url, {
          params: {
            include_offers: true,
          },
        })
      ).data
  );
  const [selectedSku, setSelectedSku] = useState<number | null>(null);

  const skus = useMemo<Sku[]>(
    () =>
      data?.offers.reduce(
        (skus: Sku[], offer: any) => skus.concat(offer.skus),
        []
      ),
    [data]
  );

  const addToCart = useCallback(async () => {
    if (selectedSku) {
      const cart = await axios.post("/api/checkout/cart", {
        base_currency: "USD",
        skus: [
          {
            sku_id: selectedSku,
            quantity: 1,
          },
        ],
      });
      dispatch(setCart(cart.data));
    }
  }, [selectedSku]);

  return (
    <div className={styles.productPage}>
      {data && (
        <>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.brand}>{data.brand}</div>
          <div className={styles.skus}>
            {skus.map((sku: Sku) => (
              <div
                key={sku.id}
                className={cx(styles.sku, {
                  [styles.selected]: sku.id === selectedSku,
                })}
                onClick={() => setSelectedSku(sku.id)}
              >
                <div>Id: {sku.id}</div>
                {sku.variant_values.map((variant: Variant) => (
                  <div>
                    {variant.variant}: {variant.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className={styles.addToCart} onClick={addToCart}>
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
}
