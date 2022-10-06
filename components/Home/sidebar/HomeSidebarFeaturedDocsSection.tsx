import { emptyFncWithMsg, isEmpty } from "~/config/utils/nullchecks";
import { fetchFeaturedDocs } from "./api/fetchFeaturedDocs";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/HomeRightSidebarStyles";
import { UnifiedDocument } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import FeaturedDocSidebarItem from "./sidebar_items/FeaturedDocSidebarItem";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";

type PaginationInfo = { isFetching: boolean; page?: number };

const useEffectFetchFeaturedDocs = ({
  paginationInfo,
  setFeaturedDocs,
  setPaginationInfo,
}: {
  paginationInfo: PaginationInfo;
  setFeaturedDocs: (featuredDocs: any) => void;
  setPaginationInfo: (paginationInfo: PaginationInfo) => void;
}): void => {
  const { isFetching, page } = paginationInfo;
  useEffect((): void => {
    if (isFetching) {
      fetchFeaturedDocs({
        onSuccess: (featuredDocs: UnifiedDocument) => {
          // TODO: calvinhlee deal with page when supported by BE
          setPaginationInfo({ isFetching: false, page });
          setFeaturedDocs(featuredDocs);
        },
        onError: emptyFncWithMsg,
      });
    }
  }, [isFetching]);
};

export default function HomeSidebarFeaturedDocsSection({
  shouldLimitNumCards,
}: {
  shouldLimitNumCards: boolean;
}): ReactElement | null {
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isFetching: true,
    page: 1,
  });
  const [featuredDocs, setFeaturedDocs] = useState<UnifiedDocument[]>([]);

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
    (uniDoc: UnifiedDocument, ind: number): ReactElement<"div"> => {
      return (
        <FeaturedDocSidebarItem
          {...uniDoc}
          key={`featuredDocSidebarItem-${ind}`}
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
        {shouldLimitNumCards ? featuredDocItems.slice(0, 2) : featuredDocItems}
      </ReactPlaceholder>
    </Fragment>
  );
}
