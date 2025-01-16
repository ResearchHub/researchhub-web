import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import FeedItemPlaceholder from "~/components/Placeholders/FeedItemPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorFeedItem from "./AuthorFeedItem";
import SearchEmpty from "~/components/Search/SearchEmpty";
import { breakpoints } from "~/config/themes/screen";
import dayjs from "dayjs";
import { getNewestCommentTimestamp } from "./utils/AuthorFeedUtils";
import BountyToggle from "~/components/Bounty/BountyToggle";
import ContentBadge from "~/components/ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";

const AuthorActivityFeed = ({
  author,
  isVisible = false,
  isFetchingAuthor = true,
  contributionType = "overview",
}) => {
  const router = useRouter();
  const [feedResults, setFeedResults] = useState([]);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsFetch, setNeedsFetch] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState(null);
  const [totalBountyAmount, setTotalBountyAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [bountySortType, setBountySortType] = useState(null);

  // Reset state when author changes
  useEffect(() => {
    if (
      isVisible &&
      String(router.query.authorId) !== String(currentAuthorId)
    ) {
      setCurrentAuthorId(router.query.authorId);
      setIsLoading(true);
      setNeedsFetch(true);
    }
  }, [router.query.authorId, isVisible]);

  useEffect(() => {
    if (router.isReady && contributionType === "bounty") {
      setBountySortType(router?.query?.sort || "bounty_offered");
    }
  }, [router.isReady]);

  useEffect(() => {
    const _fetchAuthorActivity = () => {
      let url;

      if (contributionType === "authored-papers") {
        url = API.AUTHORED_PAPER({
          authorId: router.query.authorId,
          page: 1,
        });
      } else if (contributionType === "bounty") {
        url = API.AUTHOR_ACTIVITY({
          authorId: router.query.authorId,
          type: bountySortType,
        });
      } else {
        url = API.AUTHOR_ACTIVITY({
          authorId: router.query.authorId,
          type: contributionType,
        });
      }

      return fetch(url, API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          setNextResultsUrl(res.next);
          setFeedResults(sortResults(res.results));
          setNeedsFetch(false);
          setIsLoading(false);
          setCount(res.count);

          if (contributionType === "bounty") {
            setTotalBountyAmount(res.total_bounty_amount);
          }
        })
        .catch((e) => {
          setFeedResults([]);
          // TODO: log in sentry
        });
    };

    if (needsFetch) {
      if (contributionType === "bounty" && !bountySortType) {
        return;
      } else {
        setCurrentAuthorId(router.query.authorId);
        _fetchAuthorActivity();
      }
    }
  }, [needsFetch, bountySortType, contributionType, router.query.authorId]);

  const loadNextResults = () => {
    setIsLoading(true);

    fetch(nextResultsUrl, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setIsLoading(false);
        setNextResultsUrl(res.next);
        setFeedResults([...feedResults, ...sortResults(res.results)]);
        setCount(res.count);
      })
      .catch(() => {
        setFeedResults([]);
      });
  };

  const sortResults = (results) => {
    results.map((item) => {
      if (item?.contribution_type === "COMMENTER") {
        const newestTimestamp = getNewestCommentTimestamp(item);
        item.created_date = newestTimestamp;
      }
    });

    return results.sort((a, b) => {
      if (dayjs(a.created_date) < dayjs(b.created_date)) {
        return 1;
      } else {
        return -1;
      }
    });
  };

  const paperVoteCallback = (index, paper) => {
    // Legacy callback mechanism
    if (feedResults[index]?.unified_document?.documents) {
      feedResults[index].unified_document.documents = paper;
    }
  };

  const formattedTotalBountyAmount = formatBountyAmount({
    amount: totalBountyAmount || 0,
    withPrecision: false,
  });
  return (
    <>
      {contributionType === "bounty" && (
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 50 }}
        >
          <div className={css(styles.bountyTitle)}>
            {!isLoading && (
              <>
                {bountySortType === "bounty_offered" ? (
                  <>
                    Offered {count} bounties for a total of{" "}
                    <span className={css(styles.contentBadgeWrapper)}>
                      <ContentBadge
                        label={`${`${formattedTotalBountyAmount} RSC`}`}
                        contentType="bounty"
                        bountyAmount={formattedTotalBountyAmount}
                      />
                    </span>
                  </>
                ) : (
                  <>Answered and earned {count} bounties</>
                )}
              </>
            )}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <BountyToggle
              selectedValue={bountySortType}
              handleSelect={(opt) => {
                if (opt.value !== bountySortType) {
                  router.push({ query: { ...router.query, sort: opt.value } });
                  setIsLoading(true);
                  setNeedsFetch(true);
                  setBountySortType(opt.value);
                }
              }}
            />
          </div>
        </div>
      )}

      <ReactPlaceholder
        ready={!needsFetch && !isFetchingAuthor}
        showLoadingAnimation
        customPlaceholder={<FeedItemPlaceholder rows={3} />}
      >
        {feedResults.length === 0 && !isLoading ? (
          <SearchEmpty title={"No activity found"} />
        ) : (
          <div>
            {feedResults.map((item, index) => {
              const itemType =
                contributionType === "authored-papers"
                  ? "AUTHORED_PAPER"
                  : "CONTRIBUTION";

              return (
                <AuthorFeedItem
                  key={item.id}
                  author={author}
                  itemIndex={index}
                  item={item}
                  paperVoteCallback={paperVoteCallback}
                  itemType={itemType}
                />
              );
            })}
            {nextResultsUrl && (
              <LoadMoreButton onClick={loadNextResults} isLoading={isLoading} />
            )}
          </div>
        )}
      </ReactPlaceholder>
    </>
  );
};

const styles = StyleSheet.create({
  bountyTitle: {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: 400,
    fontSize: 18,
    columnGap: 10,
    width: "80%",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "inline",
      lineHeight: "28px",
    },
  },
  contentBadgeWrapper: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "inline-flex",
    },
  },
});

export default AuthorActivityFeed;
