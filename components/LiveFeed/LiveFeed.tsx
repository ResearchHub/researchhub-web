import fetchContributionsAPI, { ApiFilters } from "./api/fetchContributionsAPI";
import {
  CommentContributionItem,
  Contribution,
  parseContribution,
} from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { ID, UnifiedDocument } from "~/config/types/root_types";
import { ReactElement, useState, useEffect } from "react";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";

import LoadMoreButton from "../LoadMoreButton";
import ContributionEntry from "./Contribution/ContributionEntry";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import UnifiedDocFeedCardPlaceholder from "../UnifiedDocFeed/UnifiedDocFeedCardPlaceholder";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import { flag } from "~/config/themes/icons";

export default function LiveFeed({ hub, isHomePage }): ReactElement<"div"> {
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: hub?.id as ID,
  });
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);

  useEffect(() => {
    let appliedFilters = { hubId: null };
    if (hub?.id) {
      appliedFilters = { hubId: hub.id };
    }
    setAppliedFilters(appliedFilters);
    loadResults(appliedFilters, null);
  }, [hub, isHomePage]);

  const loadResults = (filters: ApiFilters, url = null) => {
    if (!url) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingMore(true);
    }

    fetchContributionsAPI({
      pageUrl: url,
      filters,
      onSuccess: (response: any) => {
        const incomingResults = response.results.map((r) => {
          return parseContribution(r);
        });

        if (url) {
          setResults([...results, ...incomingResults]);
        } else {
          setResults(incomingResults);
        }

        setNextResultsUrl(response.next);
        setIsLoadingMore(false);
        setIsLoadingPage(false);
      },
    });
  };

  const resultCards = results.map((result, idx) => {
    return (
      <div className={css(styles.result)} key={`result-${idx}`}>
        <div className={css(styles.entry)}>
          <ContributionEntry
            entry={result}
            actions={[
              {
                html: (
                  <FlagButtonV2
                    modalHeaderText="Flag Content"
                    flagIconOverride={styles.flagIcon}
                    iconOverride={flag}
                    errorMsgText="Failed to flag"
                    successMsgText="Content flagged"
                    primaryButtonLabel="Flag"
                    subHeaderText="I am flagging this content because of:"
                    onSubmit={(
                      flagReason,
                      renderErrorMsg,
                      renderSuccessMsg
                    ) => {
                      let args: any = {
                        flagReason,
                        onError: renderErrorMsg,
                        onSuccess: renderSuccessMsg,
                      };

                      let item = result.item;
                      if (result.contentType.name === "comment") {
                        item = item as CommentContributionItem;
                        args.commentPayload = {
                          ...(result._raw.content_type.name === "thread" && {
                            threadID: item.id,
                            commentType: "thread",
                          }),
                          ...(result._raw.content_type.name === "comment" && {
                            commentID: item.id,
                            commentType: "comment",
                          }),
                          ...(result._raw.content_type.name === "reply" && {
                            replyID: item.id,
                            commentType: "reply",
                          }),
                        };
                      }

                      const unifiedDocument: UnifiedDocument =
                        // @ts-ignore
                        item.unifiedDocument;
                      if (
                        ["paper", "post", "hypothesis", "question"].includes(
                          unifiedDocument.documentType
                        )
                      ) {
                        args = {
                          contentType: unifiedDocument.documentType,
                          // @ts-ignore
                          contentID: unifiedDocument.document.id,
                          ...args,
                        };
                      } else {
                        console.error(
                          `${result.contentType.name} Not supported for flagging`
                        );
                        return false;
                      }

                      flagGrmContent(args);
                    }}
                  />
                ),
                label: "Flag",
                isActive: true,
              },
            ]}
          />
        </div>
      </div>
    );
  });

  return (
    <div>
      {isLoadingPage ? (
        <div>
          {Array(10)
            .fill(null)
            .map(() => (
              <LiveFeedCardPlaceholder color="#efefef" />
            ))}
        </div>
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0 ? (
              resultCards
            ) : (
              <div className={css(styles.noResults)}>No results.</div>
            )}
          </div>
          {nextResultsUrl && (
            <LoadMoreButton
              onClick={() => {
                setIsLoadingMore(true);
                loadResults(appliedFilters, nextResultsUrl);
              }}
              // @ts-ignore
              isLoadingMore={isLoadingMore}
            />
          )}
        </>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  result: {
    display: "flex",
    marginBottom: 15,
    borderBottom: `1px solid ${colors.GREY(0.5)}`,
    paddingBottom: 13,
  },
  entry: {
    width: "100%",
    display: "flex",
  },
  flagIcon: {
    width: 14,
    height: 14,
    maxHeight: 14,
    maxWidth: 14,
    minWidth: 14,
    minHeight: 14,
    fontSize: 13,
    background: "none",
    border: "none",
    marginLeft: "auto",
    color: colors.GREY(0.6),
    ":hover": {
      background: "none",
      color: colors.NEW_BLUE(1),
    },
  },
  noResults: {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(0.5),
  },
  resultsContainer: {
    marginTop: 16,
  },
  numSelected: {
    marginRight: 10,
  },
  pageLoader: {
    marginTop: 150,
  },
});
