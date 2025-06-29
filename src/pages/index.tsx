import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';
import { Offer, Page, searchOffers } from '@violetio/violet-js';
import { NextPageWithLayout } from './_app';
import styles from './Home.module.scss';
import SidePanelLayout from '@/components/SidePanelLayout/SidePanelLayout';
import Spinner from '@/components/Spinner/Spinner';
import OfferCard from '@/components/OfferCard/OfferCard';
import {
  useDesktopMediaQuery,
  useTabletMediaQuery,
} from '@/utilities/responsive';

const Home: NextPageWithLayout = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState<Page<Offer>>();
  const isDesktop = useDesktopMediaQuery();
  const isMedium = useTabletMediaQuery();

  const fetchOffers = useCallback(
    async (page: number = 1, size: number = 20) => {
      try {
        const response = await searchOffers({
          page,
          size,
          excludePublic: process.env.EXCLUDE_PUBLIC_OFFERS === 'true',
          excludeHidden: false
        });

        setOffers((prevOffers) =>
          prevOffers
            ? prevOffers.concat(response.data.content)
            : response.data.content
        );
        setPage(response.data);
      } catch (err) {
        // Error fetching offers
      }
    },
    []
  );

  const columnCount = useMemo(() => {
    if (isDesktop) {
      return 4;
    } else if (isMedium) {
      return 2;
    } else {
      return 1;
    }
  }, [isDesktop, isMedium]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  if (offers.length === 0) {
    return (
      <div className={styles.spinner}>
        <Spinner diameter={100} strokeWidth={10} />
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <div className={styles.products}>
        {offers.length > 0 && (
          <AutoSizer>
            {({ width, height }) => (
              <InfiniteLoader
                isItemLoaded={(index) => index < offers.length}
                itemCount={page?.last ? offers.length : offers.length + 1}
                loadMoreItems={async () => {
                  // We increment the page number by 2 because the page index query param starts at 1
                  // but the page returned index starts at 0
                  await fetchOffers(page?.pageable.pageNumber! + 2, 20);
                  return;
                }}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeGrid
                    className={styles.grid}
                    ref={ref}
                    onItemsRendered={(gridProps) => {
                      onItemsRendered({
                        overscanStartIndex:
                          gridProps.overscanRowStartIndex * columnCount,
                        overscanStopIndex:
                          gridProps.overscanColumnStopIndex * columnCount,
                        visibleStartIndex:
                          gridProps.visibleRowStartIndex * columnCount,
                        visibleStopIndex:
                          gridProps.visibleRowStopIndex * columnCount,
                      });
                    }}
                    columnCount={columnCount}
                    columnWidth={300}
                    height={height!}
                    rowCount={
                      offers.length % columnCount
                        ? offers.length / columnCount + 1
                        : offers.length / columnCount
                    }
                    rowHeight={430}
                    width={width!}
                  >
                    {({ columnIndex, rowIndex, style }) => (
                      <div className={styles.offerCard} style={style}>
                        {offers[rowIndex * columnCount + columnIndex] && (
                          <OfferCard
                            offer={offers[rowIndex * columnCount + columnIndex]}
                          />
                        )}
                      </div>
                    )}
                  </FixedSizeGrid>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <SidePanelLayout>{page}</SidePanelLayout>;
};

export default Home;
