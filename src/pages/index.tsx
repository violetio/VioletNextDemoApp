import useSWR from 'swr';
import Image from 'next/image';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import styles from '@/styles/Home.module.scss';
import SidePanelLayout from '@/components/SidePanelLayout/SidePanelLayout';
import { useAppDispatch } from '@/redux/store';
import { setSelectedOffer } from '@/redux/actions/offers';
import { getMerchantOffers } from '@/api/catalog/products';
import { Offer } from '@/interfaces/Offer.interface';

const Home: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  // Fetch products with catalog service
  // Switch to useSWRInfinite for pagination support
  const { data } = useSWR(
    `/api/merchants/${10003}`,
    async () => (await getMerchantOffers(10003)).data
  );
  return (
    <div className={styles.home}>
      Ultra
      <div className={styles.products}>
        {data &&
          data.content.map((offer: Offer) => (
            <div
              key={offer.id}
              onClick={() => dispatch(setSelectedOffer(offer))}
            >
              {offer.albums?.[0] && (
                <Image
                  className={styles.productImage}
                  src={offer.albums[0].primaryMedia.url}
                  alt={offer.name}
                  width={200}
                  height={200}
                />
              )}
              <div className={styles.productName}>{offer.name}</div>
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
