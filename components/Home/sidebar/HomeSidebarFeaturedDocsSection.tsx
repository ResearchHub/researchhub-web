import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchFeaturedDocs } from "./api/fetchFeaturedDocs";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { SideColumnTitle } from "~/components/Typography";
import { SimpleBounty } from "~/components/Bounty/api/fetchOpenBounties";
import { styles } from "./styles/HomeRightSidebarStyles";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

type PaginationInfo = { isFetching: boolean; page?: number };

const useEffectFetchFeaturedDocs = ({
  paginationInfo,
  setFeaturedDocs,
  setPaginationInfo,
}: {
  paginationInfo: PaginationInfo;
  setFeaturedDocs: (FeaturedDocs: any) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
}): void => {
  const { isFetching, page } = paginationInfo;
  useEffect((): void => {
    if (isFetching) {
      fetchFeaturedDocs({
        onSuccess: (FeaturedDocs: SimpleBounty) => {
          // TODO: calvinhlee deal with page when supported by BE
          setPaginationInfo({ isFetching: false, page });
          setFeaturedDocs(FeaturedDocs);
        },
        onError: emptyFncWithMsg,
      });
    }
  }, [isFetching]);
};

export default function HomeSidebarFeaturedDocsSection(): ReactElement | null {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isFetching: true,
    page: 1,
  });
  const [featuredDocs, setFeaturedDocs] = useState<SimpleBounty[]>([]);

  useEffectFetchFeaturedDocs({
    paginationInfo,
    setFeaturedDocs,
    setPaginationInfo,
  });

  const { isFetching, page = 1 } = paginationInfo;
  const isReadyToRender = !isFetching && page > 0;
  const _isLoadingMore = !isFetching && page !== 1;

  if (isEmpty(featuredDocs) && !isFetching) {
    return null;
  }
  
  const featuredDocItems = (featuredDocs ?? [])?.map(
    ({
      amount,
      content_type: { name: contentTypeName },
      created_by,
      expiration_date,
      id,
      item,
    }: SimpleBounty): ReactElement<"div"> => {
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

      return <div>hi</div>;
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
