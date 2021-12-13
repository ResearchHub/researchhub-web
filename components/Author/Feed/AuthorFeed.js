import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";
import FeedItemPlaceholder from "~/components/Placeholders/FeedItemPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorFeedItem from "./AuthorFeedItem";

const AuthorFeed = ({
  author,
  isVisible = false,
  contributionType = "overview",
  context = null,
}) => {
  const router = useRouter();
  const [feedResults, setFeedResults] = useState([]);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    const _fetchAuthorActivity = () => {
      return fetch(
        API.AUTHOR_ACTIVITY({
          authorId: router.query.authorId,
          type: contributionType,
        }),
        API.GET_CONFIG()
      )
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

    if (isVisible && !isInitialLoadComplete) {
      _fetchAuthorActivity().finally(() => {
        setIsLoading(false);
        setIsInitialLoadComplete(true);
      });
    }
  }, [isVisible, isInitialLoadComplete]);

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
      ready={isInitialLoadComplete}
      showLoadingAnimation
      customPlaceholder={<FeedItemPlaceholder rows={3} />}
    >
      <div>
        {feedResults.map((item) => {
          const itemType =
            context === "authored-papers" ? "UNIFIED_DOCUMENT" : "CONTRIBUTION";
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

export default AuthorFeed;
