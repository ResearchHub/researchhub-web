import { css } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
// import {
//   fetchOpenFeaturedDocs,
//   SimpleBounty,
// } from "~/components/Bounty/api/fetchOpenFeaturedDocs";
import { formatBountyAmount } from "~/config/types/bounty";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { SideColumnTitle } from "~/components/Typography";
import { SimpleBounty } from "~/components/Bounty/api/fetchOpenBounties";
import { styles } from "./styles/HomeRightSidebarStyles";
import BountiesSidebarItem from "./sidebar_items/BountiesSidebarItem";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";

type PaginationInfo = { isFetching: boolean; page?: number };

// const useEffectFetchOpenFeaturedDocs = ({
//   paginationInfo,
//   setOpenFeaturedDocs,
//   setPaginationInfo,
// }: {
//   paginationInfo: PaginationInfo;
//   setOpenFeaturedDocs: (FeaturedDocs: any) => void;
//   setPaginationInfo: (paginationInfo: PaginationInfo) => void;
// }): void => {
//   const { isFetching, page } = paginationInfo;
//   useEffect((): void => {
//     if (isFetching) {
//       fetchOpenFeaturedDocs({
//         onSuccess: (FeaturedDocs: SimpleBounty) => {
//           // TODO: calvinhlee deal with page when supported by BE
//           setPaginationInfo({ isFetching: false, page });
//           setOpenFeaturedDocs(FeaturedDocs);
//         },
//         onError: emptyFncWithMsg,
//       });
//     }
//   }, [isFetching]);
// };

export default function HomeSidebarFeaturedDocsSection(): ReactElement {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isFetching: true,
    page: 1,
  });
  const [openFeaturedDocs, setOpenFeaturedDocs] = useState<SimpleBounty[]>([]);

  // useEffectFetchOpenFeaturedDocs({
  //   paginationInfo,
  //   setOpenFeaturedDocs,
  //   setPaginationInfo,
  // });

  const { isFetching, page = 1 } = paginationInfo;
  const isReadyToRender = !isFetching && page > 0;
  const _isLoadingMore = !isFetching && page !== 1;

  const featuredDocItems = openFeaturedDocs?.map(
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
            <div>{"From ResearchHub"}</div>
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
        {featuredDocItems}
      </ReactPlaceholder>
    </Fragment>
  );
}
