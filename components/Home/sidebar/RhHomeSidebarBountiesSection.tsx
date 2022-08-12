import { css } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { fetchOpenBounties } from "./api/fetchOpenBounties";
import { ReactElement, useEffect, useState } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/RhHomeRightSidebarStyles";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

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
        onSuccess: (res: any) => {
          // TODO: calvinhlee deal with page when supported by BE
          setPaginationInfo({ isFetching: false, page });
          setOpenBounties;
        },
        onError: emptyFncWithMsg,
      });
    }
  }, [isFetching]);
};

export default function RhHomeSidebarBountiesSection(): ReactElement {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isFetching: true,
    page: 1,
  });
  const [openBounties, setOpenBounties] = useState<any>({});

  useEffectFetchOpenBounties({
    paginationInfo,
    setOpenBounties,
    setPaginationInfo,
  });

  const { isFetching, page = 1 } = paginationInfo;
  const isReadyToRender = !isFetching && page > 0;
  const isLoadingMore = !isFetching && page !== 1;

  return (
    <ReactPlaceholder
      ready={isReadyToRender}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={3} />}
    >
      <SideColumnTitle
        title={"Open Bounties"}
        overrideStyles={styles.RightSidebarTitle}
      />
    </ReactPlaceholder>
  );
}
