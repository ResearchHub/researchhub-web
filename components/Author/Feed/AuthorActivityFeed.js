import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import FeedItemPlaceholder from "~/components/Placeholders/FeedItemPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorFeedItem from "./AuthorFeedItem";
import { isEmpty } from "~/config/utils/nullchecks";
import EmptyState from "~/components/Author/Tabs/EmptyState";
import icons from "~/config/themes/icons";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import { breakpoints } from "~/config/themes/screen";

const AuthorActivityFeed = ({
  author,
  isVisible = false,
  contributionType = "overview",
}) => {
  const router = useRouter();
  const [feedResults, setFeedResults] = useState([]);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsInitialFetch, setNeedsInitialFetch] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth <= breakpoints.small.int);
  }, []);

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
          setFeedResults(res.results);
          setNeedsInitialFetch(false);
          setIsLoading(false);
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
  }, [needsInitialFetch]);

  const loadNextResults = () => {
    setIsLoading(true);

    fetch(nextResultsUrl, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setIsLoading(false);
        setNextResultsUrl(res.next);
        setFeedResults([...feedResults, ...res.results]);
      })
      .catch(() => {
        setFeedResults([]);
      });
  };

  return (
    <ReactPlaceholder
      ready={!needsInitialFetch}
      showLoadingAnimation
      customPlaceholder={<FeedItemPlaceholder rows={3} />}
    >
      {feedResults.length === 0 && !isLoading ? (
        <EmptyState
          message={"No activity found."}
          icon={<div>{icons.bat}</div>}
        />
      ) : (
        <div>
          {feedResults.map((item) => {
            const itemType =
              contributionType === "authored-papers"
                ? "AUTHORED_PAPER"
                : "CONTRIBUTION";

            return (
              <AuthorFeedItem
                key={item.id}
                author={author}
                item={item}
                itemType={itemType}
                isSmallScreen={isSmallScreen}
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
