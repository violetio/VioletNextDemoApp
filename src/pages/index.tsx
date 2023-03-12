import axios from "axios";
import useSWR from "swr";
import styles from "@/styles/Home.module.scss";
import Link from "next/link";

export default function Home() {
  const { data } = useSWR(
    "/api/catalog/products",
    async (url) =>
      (
        await axios.get(url, {
          params: {
            page: 1,
            size: 20,
            exclude_public: true,
          },
        })
      ).data
  );

  return (
    <div className={styles.home}>
      Products
      <div className={styles.products}>
        {data &&
          data.content.map((product: any) => (
            <Link href={`/products/${product.id}`}>
              <div key={product.id} className={styles.product}>
                {product.name}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
