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
  }, [])

  // Reset state when author changes
  useEffect(() => {
    if (isVisible && router.query.authorId !== currentAuthorId) {
      setCurrentAuthorId(parseInt(router.query.authorId));
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
          if (isSmallScreen) {
            setFeedResults(flattenActivity(res.results));
          }
          else {
            setFeedResults(res.results);
          }
        })
        .catch((e) => {
          // TODO: log in sentry
        });
    };

    if (needsInitialFetch) {
      setCurrentAuthorId(parseInt(router.query.authorId));
      _fetchAuthorActivity().finally(() => {
        setNeedsInitialFetch(false);
        setIsLoading(false);
      });
    }
  }, [needsInitialFetch]);

  // Normally, threads with comments, replies are returned however,
  // sometimes (mainly in small screens) we do not want to render the
  // threads since they are difficult to view in mobile.
  const flattenActivity = (feedResults) => {
    let newActivity = [];
    for (let i = 0; i < feedResults.length; i++) {
      if (feedResults[i].contribution_type === "COMMENTER") {
        const authorDiscussions = extractAuthorDiscussionsFromThread(feedResults[i])
        newActivity = newActivity.concat(authorDiscussions);
      }
      else {
        newActivity.push(feedResults[i]);
      }
    }

    return newActivity.sort((a,b) => {
      console.log('a.created_date', a.created_date);
      console.log('b.created_date', b.created_date);
      return (dayjs(a.created_date) > dayjs(b.created_date));
    });
  }

  const extractAuthorDiscussionsFromThread = (feedResult) => {
    const discussions = [];
    const thread = feedResult.source;

    if (thread.created_by.author_profile.id === currentAuthorId) {
      discussions.push({
        source: thread,
        unified_document: feedResult.unified_document,
        contribution_type: "COMMENTER",
        created_date: thread.created_date,
      });
    }

    thread.comments.forEach((comment) => {
      if (comment.created_by.author_profile.id === currentAuthorId) {
        discussions.push({
          source: comment,
          unified_document: feedResult.unified_document,
          contribution_type: "COMMENTER",
          created_date: comment.created_date,
        });
      }

      comment.replies.forEach((reply) => {
        if (reply.created_by.author_profile.id === currentAuthorId) {
          discussions.push({
            source: reply,
            unified_document: feedResult.unified_document,
            contribution_type: "COMMENTER",
            created_date: reply.created_date,
          });
        }        
      })
    });

    return discussions;
  };

  const loadNextResults = () => {
    setIsLoading(true);

    fetch(nextResultsUrl, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setNextResultsUrl(res.next);
        if (isSmallScreen) {
          setFeedResults(flattenActivity(res.results));
          setFeedResults([...feedResults, ...flattenActivity(res.results)]);
        }
        else {
          setFeedResults([...feedResults, ...res.results]);
        }
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
