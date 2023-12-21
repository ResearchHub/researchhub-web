import { css } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import {
  fetchOpenBounties,
  SimpleBounty,
} from "~/components/Bounty/api/fetchOpenBounties";
import { formatBountyAmount } from "~/config/types/bounty";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { SideColumnTitle } from "~/components/Typography";
import { styles } from "./styles/HomeRightSidebarStyles";
import BountiesSidebarItem from "./sidebar_items/BountiesSidebarItem";
import colors from "~/config/themes/colors";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import { parseUser } from "~/config/types/root_types";
import fetchContributionsAPI from "~/components/LiveFeed/api/fetchContributionsAPI";
import {
  CommentContributionItem,
  Contribution,
  parseContribution,
} from "~/config/types/contribution";
import getReviewCategoryScore from "~/components/Comment/lib/quill/getReviewCategoryScore";
import PeerReviewSidebarItem from "./sidebar_items/PeerReviewSidebarItem";

const MAX_CARDS_TO_DISPLAY = 6;

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
  const [peerReviews, setPeerReviews] = useState<Contribution[]>([]);

  useEffectFetchOpenBounties({
    paginationInfo,
    setOpenBounties,
    setPaginationInfo,
  });

  useEffect(() => {
    fetchContributionsAPI({
      filters: {
        contentType: "REVIEW",
      },
      onSuccess: (response: any) => {
        const incomingResults = response.results.map((r) => {
          return parseContribution(r);
        });

        setPeerReviews(incomingResults);
      },
    });
  }, []);

  const { isFetching, page = 1 } = paginationInfo;
  const isReadyToRender = !isFetching && page > 0;

  const bountyItems = openBounties
    ?.map(
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
    )
    .slice(0, MAX_CARDS_TO_DISPLAY);

  const peerReviewItems = peerReviews
    .map((result, idx) => {
      let { item } = result;
      const { createdBy } = item;
      item = item as CommentContributionItem;

      const score = getReviewCategoryScore({
        quillContents: item.content,
        category: "overall",
      });
      const docTitle = item?.unifiedDocument?.document?.title;

      if (!score || !docTitle) {
        return null;
      }

      return (
        <PeerReviewSidebarItem
          createdBy={createdBy}
          key={`peer-review-${idx}`}
          score={score}
          unifiedDocument={item.unifiedDocument}
        />
      );
    })
    .filter((pr) => pr !== null)
    .slice(0, MAX_CARDS_TO_DISPLAY);

  return (
    <Fragment>
      {/* @ts-ignore */}
      <ReactPlaceholder
        ready={isReadyToRender}
        customPlaceholder={
          <HubEntryPlaceholder
            color={colors.PLACEHOLDER_CARD_BACKGROUND}
            rows={9}
          />
        }
      >
        {bountyItems.length > 0 && (
          <>
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
                  <Link
                    href="/live?contentType=BOUNTY"
                    className={css(styles.viewAll)}
                  >
                    {"View All"}
                  </Link>
                </div>
              }
              overrideStyles={styles.RightSidebarTitle}
            />
            {bountyItems}
          </>
        )}

        {peerReviewItems.length > 0 && (
          <>
            <SideColumnTitle
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div>{"Recently Peer Reviewed"}</div>
                  <Link
                    href="/live?contentType=REVIEW"
                    className={css(styles.viewAll)}
                  >
                    {"View All"}
                  </Link>
                </div>
              }
              overrideStyles={styles.RightSidebarTitle}
            />
            {peerReviewItems}
          </>
        )}
      </ReactPlaceholder>
    </Fragment>
  );
}
