import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import FeedItemPlaceholder from "~/components/Placeholders/FeedItemPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorFeedItem from "./AuthorFeedItem";
import { isEmpty } from "~/config/utils/nullchecks";
import SearchEmpty from "~/components/Search/SearchEmpty";
import { breakpoints } from "~/config/themes/screen";
import dayjs from "dayjs";
import { getNewestCommentTimestamp } from "./utils/AuthorFeedUtils";
import BountyToggle from "~/components/Activity/BountyToggle";
import ContentBadge from "~/components/ContentBadge";

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
  const [needsInitialFetch, setNeedsInitialFetch] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState(null);
  const [totalBountyAmount, setTotalBountyAmount] = useState(0);
  const [count, setCount] = useState(0);

  // Reset state when author changes
  useEffect(() => {
    if (
      isVisible &&
      String(router.query.authorId) !== String(currentAuthorId)
    ) {
      setCurrentAuthorId(router.query.authorId);
      setIsLoading(true);
      setNeedsInitialFetch(true);
    }
  }, [router.query.authorId, isVisible]);

  useEffect(() => {
    const _fetchAuthorActivity = () => {
      let url;

      if (contributionType === "authored-papers") {
        url = API.AUTHORED_PAPER({
          authorId: router.query.authorId,
          page: 1,
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
          setNeedsInitialFetch(false);
          setIsLoading(false);

          if (contributionType === "bounty_offered") {
            setTotalBountyAmount(res.total_bounty_amount);
            setCount(res.count);
          }
        })
        .catch((e) => {
          setFeedResults([]);
          // TODO: log in sentry
        });
    };

    if (needsInitialFetch) {
      setCurrentAuthorId(router.query.authorId);
      _fetchAuthorActivity();
    }
  }, [needsInitialFetch, contributionType, router.query.authorId]);

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

  return (
    <ReactPlaceholder
      ready={!needsInitialFetch && !isFetchingAuthor}
      ready={true}
      showLoadingAnimation
      customPlaceholder={<FeedItemPlaceholder rows={3} />}
    >
      {feedResults.length === 0 && !isLoading ? (
        <SearchEmpty title={"No activity found for this user"} />
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontWeight: 500,
                fontSize: 18,
                marginBottom: 30,
                columnGap: 10,
              }}
            >
              Offered {count} bounties for a total of{" "}
              <ContentBadge label={`500 RSC`} contentType="bounty" />
            </div>
            <div style={{ marginLeft: "auto" }}>
              <BountyToggle />
            </div>
          </div>

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
  );
};

export default AuthorActivityFeed;
