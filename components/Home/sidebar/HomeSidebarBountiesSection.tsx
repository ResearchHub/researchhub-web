import { css } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
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
      content_type: { name: contentTypeName },
      created_by,
      expiration_date,
      id,
      item,
    }: SimpleBounty): ReactElement<typeof BountiesSidebarItem> => {
      // TODO: calvinhlee - Change backend payload format to resolve docType
      const {
        id: relatedDocID,
        title,
        slug,
      } = (item?.documents ?? [])[0] ?? {};
      const { document_type: itemDocType, unified_document } = item ?? {};

      const documentType = itemDocType
        ? getFEUnifiedDocType(itemDocType)
        : getFEUnifiedDocType(unified_document?.document_type);
      const resolvedRelatedDocID =
        relatedDocID ??
        unified_document?.documents?.id ??
        (unified_document?.documents ?? [])[0]?.id;
      const resolvedSlug =
        slug ??
        unified_document?.documents?.slug ??
        (unified_document?.documents ?? [])[0]?.slug;

      return (
        <BountiesSidebarItem
          bountyAmount={formatBountyAmount({ amount })}
          bountyContentSnippet={title || item?.plain_text}
          createdByAuthor={created_by?.author_profile}
          documentType={documentType}
          expirationDate={expiration_date}
          isCommentBounty={Boolean(contentTypeName)}
          key={`bounty-${id}-related-doc-${relatedDocID}`}
          relatedDocID={resolvedRelatedDocID}
          slug={resolvedSlug}
        />
      );
    }
  );

  return (
    <Fragment>
      <SideColumnTitle
        title={
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div>{"Open Bounties"}</div>
            <Link href="/?type=bounties">
              <a className={css(styles.viewAll)}>{"View All"}</a>
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
        {bountyItems.slice(0, 4)}
      </ReactPlaceholder>
    </Fragment>
  );
}
