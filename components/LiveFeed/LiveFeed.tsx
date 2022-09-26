import fetchContributionsAPI, { ApiFilters } from "./api/fetchContributionsAPI";
import {
  CommentContributionItem,
  Contribution,
  HypothesisContributionItem,
  PaperContributionItem,
  parseContribution,
  PostContributionItem,
} from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { ID, UnifiedDocument } from "~/config/types/root_types";
import { ReactElement, useState, useEffect } from "react";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import icons from "~/config/themes/icons";
import Loader from "../Loader/Loader";
import LoadMoreButton from "../LoadMoreButton";
import ContributionEntry from "./Contribution/ContributionEntry";
import { flagGrmContent } from "../Flag/api/postGrmFlag";

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

  const resultCards = () => {
    return results.map((r, idx) => {
      const cardActions = [
        {
          html: (
            <FlagButtonV2
              modalHeaderText="Flag Content"
              flagIconOverride={styles.flagIcon}
              iconOverride={icons.flag}
              errorMsgText="Failed to flag"
              successMsgText="Content flagged"
              primaryButtonLabel="Flag"
              subHeaderText="I am flagging this content because of:"
              onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
                let args: any = {
                  flagReason,
                  onError: renderErrorMsg,
                  onSuccess: renderSuccessMsg,
                };

                let item = r.item;
                if (r.contentType.name === "comment") {
                  item = item as CommentContributionItem;
                  args.commentPayload = {
                    ...(r._raw.content_type.name === "thread" && {
                      threadID: item.id,
                    }),
                    ...(r._raw.content_type.name === "comment" && {
                      commentID: item.id,
                    }),
                    ...(r._raw.content_type.name === "reply" && {
                      replyID: item.id,
                    }),
                  };
                }

                // @ts-ignore
                const unifiedDocument: UnifiedDocument = item.unifiedDocument;
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
                    `${r.contentType.name} Not supported for flagging`
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
      ];

      return (
        // @ts-ignore
        <div className={css(styles.result)} key={`result-${idx}`}>
          <div className={css(styles.entry)}>
            <ContributionEntry entry={r} actions={cardActions} />
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {isLoadingPage ? (
        <Loader
          containerStyle={styles.pageLoader}
          key={"loader"}
          loading={true}
          size={45}
          color={colors.NEW_BLUE()}
        />
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0 ? (
              resultCards()
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
  resultsContainer: {},
  numSelected: {
    marginRight: 10,
  },
  pageLoader: {
    marginTop: 150,
  },
});
