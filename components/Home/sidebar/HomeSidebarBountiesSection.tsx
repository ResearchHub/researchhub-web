import { css } from "aphrodite";
import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import {
  fetchOpenBounties,
  SimpleBounty,
} from "~/components/Bounty/api/fetchOpenBounties";
import { formatBountyAmount } from "~/config/types/bounty";
import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/HomeRightSidebarStyles";
import BountiesSidebarItem from "./sidebar_items/BountiesSidebarItem";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import { parseUser } from "~/config/types/root_types";

const TEMP_BOUNTY_DISPLAY_CUT_OFF = 5;

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
        onSuccess: (bounties: SimpleBounty) => {
          // TODO: calvinhlee deal with page when supported by BE
          setPaginationInfo({ isFetching: false, page });
          setOpenBounties(bounties);
        },
        model: "rhcommentmodel",
        onError: emptyFncWithMsg,
      });
    }
  }, [isFetching]);
};

export default function HomeSidebarBountiesSection({
  shouldLimitNumCards,
}: {
  shouldLimitNumCards: boolean;
}): ReactElement | null {
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

  if (isEmpty(openBounties) && !isFetching) {
    return null;
  }

  const bountyItems = openBounties?.map(
    ({
      amount,
      content_type: { name: contentTypeName },
      created_by,
      expiration_date,
      id,
      item,
      plainText,
      unifiedDocument,
    }: SimpleBounty): ReactElement<typeof BountiesSidebarItem> => {
      return (
        <BountiesSidebarItem
          bountyAmount={formatBountyAmount({ amount })}
          rawBountyAmount={amount}
          bountyContentSnippet={plainText}
          createdBy={parseUser(created_by)}
          createdByAuthor={created_by?.author_profile}
          documentType={unifiedDocument?.documentType}
          expirationDate={expiration_date}
          isCommentBounty={Boolean(contentTypeName)}
          key={`bounty-${id}-related-doc-${unifiedDocument?.document?.id}`}
          relatedDocID={unifiedDocument?.document?.id}
          slug={unifiedDocument?.document?.slug}
        />
      );
    }
  );

  return (
    <Fragment>
      <SideColumnTitle
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div>{"Open Bounties"}</div>
            <Link href="/?type=bounty" className={css(styles.viewAll)}>
              {"View All"}
            </Link>
          </div>
        }
        overrideStyles={styles.RightSidebarTitle}
      />
      <ReactPlaceholder
        ready={isReadyToRender}
        customPlaceholder={
          <HubEntryPlaceholder
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            rows={3}
          />
        }
      >
        {bountyItems.slice(
          0,
          shouldLimitNumCards ? 3 : TEMP_BOUNTY_DISPLAY_CUT_OFF
        )}
      </ReactPlaceholder>
    </Fragment>
  );
}
