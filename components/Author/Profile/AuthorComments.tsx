import { PaginatedApiResponse } from "~/config/types/root_types";
import {
  parseContribution,
  getContributionUrl,
} from "~/config/types/contribution";
import ContributionEntry from "~/components/LiveFeed/Contribution/ContributionEntry";
import Link from "next/link";
import colors from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import LoadMore from "~/components/shared/LoadMore";
import fetchContributionsAPI from "~/components/LiveFeed/api/fetchContributionsAPI";

const AuthorComments = ({
  commentApiResponse,
  withLoadMore = true,
}: {
  commentApiResponse: PaginatedApiResponse;
  withLoadMore?: boolean;
}) => {
  
  const [_commentApiResponse, setCommentApiResponse] = useState<PaginatedApiResponse>(commentApiResponse);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const commentContributions = _commentApiResponse.results.map((r) => {
    return parseContribution(r);
  });

  const entries = commentContributions
    .map((result, idx) => {
      try {
        const url = getContributionUrl(result);
        return {
          url,
          el: (
            <ContributionEntry
              key={`entry-${idx}`}
              entry={result}
              actions={[]}
              context="live-feed"
            />
          ),
        };
      } catch (error) {
        console.error("[Contribution] Could not render Entry", error);
        return null;
      }
    })
    .filter((r) => r !== null);

  const resultCards = entries.map((entry, idx) => {
    return (
      <Link
        href={entry!.url}
        className={css(styles.linkWrapper, styles.entryWrapper)}
      >
        <div key={`wrapped-entry-${idx}`} className={css(styles.result)}>
          <div className={css(styles.entry)}>{entry!.el}</div>
        </div>
      </Link>
    );
  });

  return (
  <div className={css(styles.commentWrapper)}>
    {resultCards}
    {withLoadMore && _commentApiResponse.next && (
        <LoadMore
          onClick={async () => {
            setIsFetchingMore(true);
            try {
              const response:PaginatedApiResponse = await fetchContributionsAPI({ pageUrl: _commentApiResponse.next });
              
              const nextContributions = response.results
              response.results = [
                ..._commentApiResponse.results,
                ...nextContributions,
              ]

              setCommentApiResponse(response);
              setIsFetchingMore(false);
            }
            catch (e) {
              console.error("Error fetching more contributions", e);
              setIsFetchingMore(false);
            }
          }}

          isLoading={isFetchingMore}
        />
      )}    
  </div>);
};

const styles = StyleSheet.create({
  result: {
    display: "flex",
    borderBottom: `1px solid ${colors.GREY_LINE(1.0)}`,
    borderRadius: "4px",
    padding: 16,
    background: "white",
    ":hover": {
      transition: "0.2s",
      background: colors.LIGHTER_GREY(1.0),
    },
  },
  entryWrapper: {
    cursor: "pointer",
  },
  placeholderWrapper: {
    width: "100%",
  },
  entry: {
    width: "100%",
    display: "flex",
  },
  linkWrapper: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
  },
  commentWrapper: {},
  profilePage: {
    backgroundColor: "rgb(250, 250, 250)",
  },
  profileContent: {
    width: "1000px",
    margin: "0 auto",
  },
  activityWrapper: {
    width: 700,
    marginTop: 20,
  },
  mainContentWrapper: {
    margin: "0 auto",
    backgroundColor: "rgb(255, 255, 255)",
    borderTop: "1px solid #DEDEE6",
    border: "1px solid #F5F5F9",
    padding: 20,
  },
  mainContent: {
    width: "1000px",
    margin: "0 auto",
  },
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
  },
});

export default AuthorComments;
