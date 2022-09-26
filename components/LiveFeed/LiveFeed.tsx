import { ApiFilters } from "./api/fetchContributionsAPI";
import { CommentContributionItem, Contribution, HypothesisContributionItem, PaperContributionItem, parseContribution, PostContributionItem } from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { FLAG_REASON } from "../Flag/config/flag_constants";
import { ID, UnifiedDocument } from "~/config/types/root_types";
import { KeyOf } from "~/config/types/root_types";
import { ReactElement, useState, useEffect } from "react";
import colors from "~/config/themes/colors";
import fetchContributionsAPI from "./api/fetchContributionsAPI";
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
  const [isLoadingMore, setIsLoadingMore] = useState<Boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<Boolean>(true);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);

  useEffect(() => {
    let appliedFilters = { hubId: null }  
    if (hub?.id) {
      appliedFilters = { hubId: hub.id }
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
        const incomingResults = response.results.map((r) =>{

      //   const l =         {
      //     "item": {
      //         "content_type": {
      //             "id": 24,
      //             "name": "thread"
      //         },
      //         "item": {
      //             "id": 311,
      //             "unified_document": {
      //                 "id": 1521,
      //                 "documents": [
      //                     {
      //                         "id": 34,
      //                         "renderable_text": "",
      //                         "title": "Coffee Consumption May Mitigate the Risk for Acute Kidney Injury: Results From the Atherosclerosis Risk in Communities Study",
      //                         "slug": "feedback-request-peer-reviews-feature-on-research-hub"
      //                     }
      //                 ],
      //                 "document_type": "DISCUSSION"
      //             }
      //         },
      //         "amount": "1000.0000000000",
      //         "unified_document": 1521
      //     },
      //     "content_type": {
      //         "id": 109,
      //         "name": "bounty"
      //     },
      //     "created_by": {
      //         "id": 8,
      //         "author_profile": {
      //             "id": 416,
      //             "first_name": "Kobe",
      //             "last_name": "Attias",
      //             "profile_image": "https://lh3.googleusercontent.com/a/AATXAJxMWwF8N8q__74Pl5_Fvp_srsuekx5iNmsB54eBURA=s96-c"
      //         },
      //         "first_name": "Kobe",
      //         "last_name": "Attias"
      //     },
      //     "hubs": [],
      //     "created_date": "2022-08-18T19:41:43.043938Z"
      // };

          return parseContribution(r)
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

                let args:any = {
                  flagReason,
                  onError: renderErrorMsg,
                  onSuccess: renderSuccessMsg
                }

                let item = r.item;
                if (r.contentType.name === "comment") {
                  item = item as CommentContributionItem
                  args.commentPayload = {
                    ...(r._raw.content_type.name === "thread" && {threadID: item.id}),
                    ...(r._raw.content_type.name === "comment" && {commentID: item.id}),
                    ...(r._raw.content_type.name === "reply" && {replyID: item.id}),
                  };
                }
                
                // @ts-ignore
                const unifiedDocument:UnifiedDocument = item.unifiedDocument;
                if (["paper", "post", "hypothesis", "question"].includes(unifiedDocument.documentType)) {
                  args = {
                    contentType: unifiedDocument.documentType,
                    // @ts-ignore
                    contentID: unifiedDocument.document.id,
                    ...args
                  }
                }
                else {
                  console.error(`${r.contentType.name} Not supported for flagging`);
                  return false;
                }                
                flagGrmContent(args);
              }}
            />
          ),
          label: "Flag",
          isActive: true,
        }];

      return (
        // @ts-ignore
        <div className={css(styles.result)} key={`result-${idx}` }>
          <div className={css(styles.entry)}>
            <ContributionEntry
              entry={r}
              actions={cardActions}
            />
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
    marginBottom: 25,
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
