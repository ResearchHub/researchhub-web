import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import FeedItemPlaceholder from "~/components/Placeholders/FeedItemPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorFeedItem from "./AuthorFeedItem";
import { isEmpty } from "~/config/utils/nullchecks";

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

  // Reset state when author changes
  useEffect(() => {
    if (isVisible && router.query.authorId !== currentAuthorId) {
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
        })
        .catch((e) => {
          // TODO: log in sentry
        });
    };

    if (needsInitialFetch) {
      setCurrentAuthorId(router.query.authorId);
      _fetchAuthorActivity().finally(() => {
        setNeedsInitialFetch(false);
        setIsLoading(false);
      });
    }
  }, [needsInitialFetch]);

  const loadNextResults = () => {
    setIsLoading(true);

    fetch(nextResultsUrl, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setFeedResults([...feedResults, ...res.results]);
        setNextResultsUrl(res.next);

        // TODO: We probably need to do this
        // fetchAndSetUserVotes(res.results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ReactPlaceholder
      ready={!needsInitialFetch}
      showLoadingAnimation
      customPlaceholder={<FeedItemPlaceholder rows={3} />}
    >
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
            />
          );
        })}
        {nextResultsUrl && (
          <LoadMoreButton onClick={loadNextResults} isLoading={isLoading} />
        )}
      </div>
    </ReactPlaceholder>
  );
};

export default AuthorActivityFeed;
