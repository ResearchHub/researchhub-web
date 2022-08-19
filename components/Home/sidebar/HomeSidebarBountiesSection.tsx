import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import {
  fetchOpenBounties,
  SimpleBounty,
} from "~/components/Bounty/api/fetchOpenBounties";
import { ReactElement, useEffect, useState } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/HomeRightSidebarStyles";
import BountiesSidebarItem from "./SidebarItems/BountiesSidebarItem";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import Link from "next/link";
import { css, StyleSheet } from "aphrodite";
import { formatBountyAmount } from "~/config/types/bounty";

type PaginationInfo = { isFetching: boolean; page?: number };

const useEffectFetchOpenBounties = ({
  paginationInfo,
  setOpenBounties,
  setPaginationInfo,
}: {
  paginationInfo: PaginationInfo;
  setOpenBounties: (bounties: any) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
}): void => {
  const { isFetching, page } = paginationInfo;
  useEffect((): void => {
    if (isFetching) {
      fetchOpenBounties({
        onSuccess: (bounties: any) => {
          // TODO: calvinhlee deal with page when supported by BE
          setPaginationInfo({ isFetching: false, page });
          setOpenBounties(bounties);
        },
        onError: emptyFncWithMsg,
      });
    }
  }, [isFetching]);
};

export default function HomeSidebarBountiesSection(): ReactElement {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isFetching: true,
    page: 1,
  });
  const [openBounties, setOpenBounties] = useState<SimpleBounty[]>([]);

  useEffectFetchOpenBounties({
    paginationInfo,
    setOpenBounties,
    setPaginationInfo,
  });

  const { isFetching, page = 1 } = paginationInfo;
  const isReadyToRender = !isFetching && page > 0;
  const _isLoadingMore = !isFetching && page !== 1;

  const bountyItems = openBounties?.map(
    ({
      amount,
      created_by,
      expiration_date,
      item,
      id,
    }: SimpleBounty): ReactElement<typeof BountiesSidebarItem> => {
      const {
        id: relatedDocID,
        title,
        slug,
      } = (item?.documents ?? [])[0] ?? {};
      return (
        <BountiesSidebarItem
          bountyAmount={formatBountyAmount({ amount })}
          bountyContentSnippet={title || item?.plain_text}
          createdByAuthor={created_by?.author_profile}
          expirationDate={expiration_date}
          relatedDocID={relatedDocID}
          key={`bounty-${id}-related-doc-${relatedDocID}`}
          slug={slug}
        />
      );
    }
  );
  return (
    <ReactPlaceholder
      ready={isReadyToRender}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={3} />}
    >
      <SideColumnTitle
        title={
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div>Open Bounties </div>
            <Link href="/?type=bounties">
              <a className={css(styles.viewAll)}>View All</a>
            </Link>
          </div>
        }
        overrideStyles={styles.RightSidebarTitle}
      />
      {bountyItems}
    </ReactPlaceholder>
  );
}
