import { ID, PaginatedApiResponse } from "~/config/types/root_types";
import {
  parseContribution,
  getContributionUrl,
  Contribution,
} from "~/config/types/contribution";
import ContributionEntry from "~/components/LiveFeed/Contribution/ContributionEntry";
import Link from "next/link";
import colors from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import LoadMore from "~/components/shared/LoadMore";
import fetchContributionsAPI from "~/components/LiveFeed/api/fetchContributionsAPI";
import SearchEmpty from "~/components/Search/SearchEmpty";

const AuthorComments = ({
  withLoadMore = true,
  authorId,
  contentType = "ALL", 
  limit = null,
}: {
  withLoadMore?: boolean;
  authorId: ID;
  contentType: "ALL" | "REVIEW" | "CONVERSATION" | "BOUNTY";
  limit?: number | null;
}) => {
  
  const [commentApiResponse, setCommentApiResponse] = useState<PaginatedApiResponse|null>(null);
  const [parsedContributions, setParsedContributions] = useState<Contribution[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    fetchContributionsAPI({
      filters: {
        contentType,
        authorId,
      },
    }).then((commentApiResponse) => {
      setCommentApiResponse(commentApiResponse);
    })
  },[])

  useEffect(() => {
    if (commentApiResponse === null) {
      return;
    }

    const commentContributions = commentApiResponse.results.map((r) => {
      return parseContribution(r);
    });
    setParsedContributions(commentContributions);  
  }, [commentApiResponse])



  const entries = parsedContributions
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

  let resultCards = entries.map((entry, idx) => {
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

  resultCards = limit ? resultCards.slice(0, limit) : resultCards;

  return (
  <div className={css(styles.commentWrapper)}>
    {(resultCards.length === 0 && !commentApiResponse === null) && (
      <div style={{ minHeight: 250, display: "flex", justifyContent: "center", width: "100%" }}>
        <SearchEmpty title={"No author activity found in this section."} />
      </div>
  )}

    {resultCards}
    {withLoadMore && commentApiResponse?.next && (
        <LoadMore
          onClick={async () => {
            setIsFetchingMore(true);
            try {
              const response:PaginatedApiResponse = await fetchContributionsAPI({ pageUrl: commentApiResponse.next });
              
              const nextContributions = response.results
              response.results = [
                ...commentApiResponse.results,
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
