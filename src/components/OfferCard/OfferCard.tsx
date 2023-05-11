import Link from 'next/link';
import { Offer } from '@violetio/violet-js';
import styles from './OfferCard.module.scss';
import StoreIcon from '@/public/svg/store.svg';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  return (
    <Link key={offer.id} href={`/offer?offerId=${offer.id}`}>
      <div className={styles.offer}>
        {offer.albums?.[0] && (
          <div className={styles.imageContainer}>
            <img
              className={styles.productImage}
              src={offer.albums[0].primaryMedia.url}
              alt={offer.name}
              width={272}
              height={272}
            />
            <div className={styles.overlay} />
          </div>
        )}
        <div className={styles.productName}>{offer.name}</div>
        <div className={styles.vendor}>{offer.vendor}</div>
        <div className={styles.seller}>
          <StoreIcon className={styles.icon} />
          {offer.seller}
        </div>
        <div className={styles.price}>
          {(offer.minPrice! / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: offer.currency,
          })}
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;
