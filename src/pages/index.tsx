import useSWR from "swr";
import styles from "@/styles/Home.module.scss";
import Image from "next/image";
import { Product } from "@/interfaces/Product.interface";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import SidePanelLayout from "@/components/SidePanelLayout/SidePanelLayout";
import { useAppDispatch } from "@/redux/store";
import { setSelectedProduct } from "@/redux/actions/products";
import { getProducts, getProductsEndpoint } from "@/api/catalog/products";

const Home: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  // Fetch products with catalog service
  // Switch to useSWRInfinite for pagination support
  const { data } = useSWR(
    getProductsEndpoint,
    async () => (await getProducts()).data
  );

  return (
    <div className={styles.home}>
      Ultra
      <div className={styles.products}>
        {data &&
          data.content.map((product: Product) => (
            <div
              key={product.id}
              onClick={() => dispatch(setSelectedProduct(product))}
            >
              {product.defaultImageUrl && (
                <Image
                  className={styles.productImage}
                  src={product.defaultImageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                />
              )}
              <div className={styles.productName}>{product.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <SidePanelLayout>{page}</SidePanelLayout>;
};

export default Home;
