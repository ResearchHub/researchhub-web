import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useRef } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchFlaggedContributions from "./api/fetchFlaggedContributionsAPI";
import flagAndRemove, { buildParamsForFlagAndRemoveAPI } from "./api/flagAndRemoveAPI";
import CheckBox from "~/components/Form/CheckBox";
import renderContributionEntry from "./utils/renderContributionEntry";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import LoadMoreButton from "../LoadMoreButton";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { KeyOf } from "~/config/types/root_types";
import Loader from "../Loader/Loader";
import AuthorAvatar from "../AuthorAvatar";
import { ApiFilters, verdictOpts } from './api/fetchFlaggedContributionsAPI';
import { Contribution, parseContribution } from "~/config/types/contribution";
import ALink from "../ALink";
import { FLAG_REASON } from "~/components/Flag/config/constants";
import dismissFlaggedContent from "./api/dismissFlaggedContentAPI";
import removeFlaggedContent from "./api/removeFlaggedContentAPI";


function FlaggedContentDashboard({ showMessage, setMessage }) : ReactElement<"div"> {
  const router = useRouter();
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: (router.query.hub_id as ID),
    verdict: (router.query.verdict as string) || "OPEN",
  });  
  const [isLoadingMore, setIsLoadingMore] = useState<Boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<Boolean>(true);
  
  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  

  useEffect(() => {
    const appliedFilters = {
      hubId: (router.query.hub_id as ID),
      verdict: (router.query.verdict as string) || "OPEN",
    }
    setAppliedFilters(appliedFilters);
    loadResults(appliedFilters, null);
  }, [router.query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = isClickOutsideCheckbox(event, [multiSelectRef.current]);
      
      if (isOutsideClick) {
        setSelectedResultIds([]);
      }
    }
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    }
  }, [selectedResultIds]);

  useEffectFetchSuggestedHubs({ setSuggestedHubs: (hubs) => {
    setSuggestedHubs([{label: "All", value: undefined}, ...hubs])
    const selected = hubs.find(h => String(h.id) === String(router.query.hub_id))
    setAppliedFilters({...appliedFilters, hubId: selected?.id});
  } });

  const handleWindowScroll = () => {
    const navEl:(HTMLElement|null) = document.querySelector(".navbar");
    const multiSelectEl:HTMLElement|null = multiSelectRef.current;
    
    // @ts-ignore
    if (multiSelectEl && window.scrollY > navEl.clientHeight && selectedResultIds.length > 0) {
      // @ts-ignore
      multiSelectEl.style.top = (navEl?.clientHeight + 1) + "px";
      setIsMultiSelectSticky(true);
    }
    else {
      setIsMultiSelectSticky(false);
    }
  }

  const handleHubFilterChange = (selectedHub: any) => {

    let query = { ...router.query }
    if (selectedHub.id) {
      query.hub_id = selectedHub.id;
    }
    else {
      delete query.hub_id;
    }

    const newFilters= {
      hubId: selectedHub.id,
      ...appliedFilters      
    }    

    setIsLoadingPage(true);
    setSelectedResultIds([]);
    setAppliedFilters(newFilters);
    loadResults(newFilters, null);

    router.push({
      query,
    });
  }

  const handleVerdictChange = (selectedVerdict: any) => {
    let query = { ...router.query }
    if (selectedVerdict.value) {
      query.verdict = selectedVerdict.value;
    }
    else {
      delete query.verdict;
    }

    const newFilters= {
      ...appliedFilters,
      verdict: selectedVerdict.value,
    }    

    setIsLoadingPage(true);
    setSelectedResultIds([]);
    setAppliedFilters(newFilters);
    loadResults(newFilters, null);

    router.push({
      query,
    });
  }
  
  const handleResultSelect = (selectedId) => {
    if (selectedResultIds.includes(selectedId)) {
      setSelectedResultIds(
        selectedResultIds.filter(id => id !== selectedId)
      )
    }
    else {
      setSelectedResultIds([...selectedResultIds, selectedId]);
    }
  }

  const loadResults = (filters:ApiFilters, url = null) => {
    if (!url) {
      setIsLoadingPage(true);
    }
    else {
      setIsLoadingMore(true);
    }

    fetchFlaggedContributions({
      pageUrl: url,
      filters,
      onSuccess: (response:any) => {
        const incomingResults = response.results.map(r => parseContribution(r))
        if (url) {
          setResults([...results, ...incomingResults]);
        }
        else {
          setResults(incomingResults);
        }

        setNextResultsUrl(response.next);
        setIsLoadingMore(false);
        setIsLoadingPage(false);
      }
    })
  }

  const resultCards = () => {
    
    return results.map((r) => {
      // @ts-ignore
      const isOneLineAction = (r.flaggedBy.authorProfile.id === r?.verdict?.createdBy?.authorProfile?.id);

      const cardActions = [{
        html: (
          <FlagButtonV2
            modalHeaderText="Flag and Remove"
            flagIconOverride={styles.flagIcon}
            iconOverride={icons.trashSolid}
            defaultReason={r.reasonChoice}
            onSubmit={(verdict: KeyOf<typeof FLAG_REASON>) => {
              removeFlaggedContent({
                apiParams: {
                  flagIds: [r.id],
                  // @ts-ignore
                  verdictChoice: verdict,
                },
                onSuccess: () => {
                  setMessage("Flagged Content removed");
                  showMessage({ show: true, error: false });
                  setResults(results.filter(res => res.id !== r.id));
                },
                onError: () => {
                  setMessage("Failed to remove flagged content");
                  showMessage({ show: true, error: true });
                },
              });
            }}
            subHeaderText={"hellow there"}
          />
        ),
        label: "Remove Content",
        style: styles.flagAndRemove,
        isActive: appliedFilters.verdict === "OPEN",
      }, {
        html: (
          <span
            className={css(styles.bulkAction, styles.checkIcon, styles.bulkActionApprove)}
            onClick={() => {
              if (confirm("Dismiss flag?")) {
                dismissFlaggedContent({
                  apiParams: {
                    flagIds: [r.id],
                    // @ts-ignore
                    verdictChoice: r.reasonChoice,
                  },
                  onSuccess: () => {
                    setMessage("Flag dismissed");
                    showMessage({ show: true, error: false });
                    setResults(results.filter(res => res.id !== r.id));
                  },
                  onError: () => {
                    setMessage("Failed to dismiss flag");
                    showMessage({ show: true, error: true });
                  },
                });
              }
            }}
          >
            {icons.check}
          </span>
        ),
        label: "Dismiss Flag",
        // style: styles.flagAndRemove,
        isActive: appliedFilters.verdict === "OPEN",
      }]

      return (
        <div className={css(styles.result)} key={r.id}>
          {r.verdict && !isOneLineAction &&
            <>
              <div className={css(styles.actionDetailsRow, styles.verdictActionDetailsRow)}>
                <div className={css(styles.avatarContainer)}>
                  {/* @ts-ignore */}
                  <AuthorAvatar size={20} author={r.verdict.createdBy.authorProfile} />
                </div>
                <span className={css(styles.actionContainer)}>
                  {/* @ts-ignore */}
                  <ALink href={`/user/${r.verdict.createdBy.authorProfile.id}/overview`}>{r.verdict.createdBy.authorProfile.firstName} {r.verdict.createdBy.authorProfile.lastName}</ALink>
                  <span className={css(styles.flagText)}>
                    {appliedFilters.verdict === "APPROVED" ?
                      <>
                        <span className={css(styles.icon)}>&nbsp;{icons.check}</span>
                        &nbsp;dismissed flag
                      </>
                    : 
                    <>
                        <span className={css(styles.icon, styles.trashIcon)}>&nbsp;{icons.trash}</span>
                        &nbsp;removed this content due to <span className={css(styles.reason)}>{FLAG_REASON[r.verdict.verdictChoice]}</span>                      
                      </>
                    }
                  </span>
                </span>
                <span className={css(styles.dot)}> • </span>
                <span className={css(styles.timestamp)}>2 days ago</span>
              </div>
              <div className={css(styles.timelineSeperator)}></div>            
            </>
          }

          <div className={css(styles.actionDetailsRow)}>
            <div className={css(styles.avatarContainer)}>
              {/* @ts-ignore */}
              <AuthorAvatar size={20} author={r.flaggedBy.authorProfile} />
            </div>
            <span className={css(styles.actionContainer)}>
              {/* @ts-ignore */}
              <ALink href={`/user/${r.flaggedBy.authorProfile.id}/overview`}>{r.flaggedBy.authorProfile.firstName} {r.flaggedBy.authorProfile.lastName}</ALink>
              <span className={css(styles.flagText)}>
                { isOneLineAction ? (
                  appliedFilters.verdict === "APPROVED" ?
                    <>
                      <span className={css(styles.icon)}>&nbsp;{icons.check}</span>
                      &nbsp;dismissed flag
                    </>
                  : 
                    <>
                      <span className={css(styles.icon, styles.trashIcon)}>&nbsp;{icons.trash}</span>
                      {/* @ts-ignore */}
                      &nbsp;removed this content due to <span className={css(styles.reason)}>{FLAG_REASON[r.verdict.verdictChoice]}</span>                      
                    </>
                  ) : (
                    <>
                      <span className={css(styles.icon)}>&nbsp;{icons.flagOutline}</span>
                      {/* @ts-ignore */}
                      &nbsp;flagged this content as <span className={css(styles.reason)}>{FLAG_REASON[r.reasonChoice]}</span>                  
                    </>
                )}
              </span>
            </span>
            <span className={css(styles.dot)}> • </span>
            <span className={css(styles.timestamp)}>2 days ago</span>
          </div>

          <div className={css(styles.entryContainer)}>
            <div className={`${css(styles.checkbox)} cbx`}>
              <CheckBox
                key={`${r.contentType}-${r.id}`}
                label=""
                isSquare
                // @ts-ignore
                id={r.id}
                active={selectedResultIds.includes(r.id)}
                onChange={(id) => handleResultSelect(id)}
                labelStyle={undefined}
              />          
            </div>
            <div className={css(styles.entry)}>
              {renderContributionEntry(r, cardActions)}
            </div>
          </div>
        </div>
      )
    })
  }

  const selectedHub = suggestedHubs.find(h => String(appliedFilters.hubId) === String(h.id)) || {"label": "All", id: undefined, value: undefined};
  const selectedVerdict = verdictOpts.find(v => String(appliedFilters.verdict) === String(v.value)) || {"label": "Open", value: "OPEN"};
  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Flagged Content
        </div>
        <div className={css(styles.filters)}>
          <div className={css(styles.filter)}>
            <FormSelect
              containerStyle={styles.dropdown}
              inputStyle={styles.inputOverride}
              id="hubs"
              label=""
              onChange={(_id: ID, selectedHub: any): void =>
                handleHubFilterChange(selectedHub)
              }
              options={suggestedHubs}
              placeholder=""
              value={selectedHub}
            />       
          </div>
          <div className={css(styles.filter)}>
            <FormSelect
              containerStyle={styles.dropdown}
              inputStyle={styles.inputOverride}
              id="verdict"
              label=""
              onChange={(_id: ID, selectedVerdict: any): void =>
                handleVerdictChange(selectedVerdict)
              }
              options={verdictOpts}
              placeholder=""
              value={selectedVerdict}
            />
          </div>
        </div>
      </div>
      <div className={css(styles.multiSelect, isMultiSelectSticky && styles.multiSelectSticky)} ref={multiSelectRef}>
        {selectedResultIds.length > 0 &&
          <div className={css(styles.activeDetailsRow)}>
            <span className={css(styles.numSelected)}>{selectedResultIds.length} selected.</span>
            <div className={css(styles.bulkActions)}>
              <span
                className={css(styles.bulkAction, styles.bulkActionRemove, styles.flagIcon)}
                onClick={() => {
                  if (window.confirm("Remove all selected content?")) {
                    removeFlaggedContent({
                      apiParams: {
                        flagIds: selectedResultIds,
                        // @ts-ignore
                        verdictChoice: verdict,
                      },
                      onSuccess: () => {
                        setMessage("Flagged Content removed");
                        showMessage({ show: true, error: false });
                        setResults(results.filter(res => !selectedResultIds.includes(res.id)));
                        setSelectedResultIds([]);
                      },
                      onError: () => {
                        setMessage("Failed to remove flagged content");
                        showMessage({ show: true, error: true });
                      },
                    });
                  }
                }}
              >
                {icons.trashSolid}
              </span>
              <span 
                className={css(styles.bulkAction, styles.checkIcon, styles.bulkActionApprove)}
                onClick={() => {
                  if (confirm("Dismiss flags?")) {
                    dismissFlaggedContent({
                      apiParams: {
                        flagIds: selectedResultIds,
                      },
                      onSuccess: () => {
                        setMessage("Flags dismissed");
                        showMessage({ show: true, error: false });
                        setResults(results.filter(res => !selectedResultIds.includes(res.id)));
                        setSelectedResultIds([]);
                      },
                      onError: () => {
                        setMessage("Failed to dismiss flags");
                        showMessage({ show: true, error: true });
                      },
                    });
                  }                  
                }}
              >
                {icons.check}
              </span>
            </div>
          </div>
        }
        {results.length > 0 && selectedResultIds.length === 0 &&
          <span className={css(styles.redoSmall)} onClick={() => loadResults(appliedFilters)}>{icons.redo}</span>
        }
      </div>
      {isLoadingPage ? (
        <Loader containerStyle={styles.pageLoader} key={"loader"} loading={true} size={45} color={colors.NEW_BLUE()} />
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0
              ? resultCards()
              : 
                <div className={css(styles.noResults)}>
                  No results.
                  <span className={css(styles.redoBig)} onClick={() => loadResults(appliedFilters)}>{icons.redo}</span>
                </div>
            }
          </div>
          {nextResultsUrl && (
            // @ts-ignore
            <LoadMoreButton onClick={() => loadResults(appliedFilters, nextResultsUrl)} isLoadingMore={isLoadingMore} />
          )}
        </>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  "result": {
    display: "flex",
    marginBottom: 30,
    flexDirection: "column",
  },
  "entry": {
    borderRadius: 2,  
    background: "white",
    border: `1px solid ${colors.GREY()}`,
    width: "100%",
    display: "flex",
    userSelect: "none",
    padding: 10,
  },
  "entryContainer": {
    display: "flex",
  },
  "flagIcon": {
    width: 14,
    height: 14,
    maxHeight: 14,
    maxWidth: 14,
    minWidth: 14,
    minHeight: 14,
    fontSize: 13,
    border: "1px solid rgba(36, 31, 58, 0.1)",
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    padding: 5,
    borderRadius: "50%",
    justifyContent: "center",
    // background: colors.RED(0.1),
    color: colors.RED(0.6),
    ":hover": {
      backgroundColor: "#EDEDF0",
      color: "rgba(36, 31, 58, 0.8)",    
    }    
  },
  "redoSmall": {
    fontSize: 16,
    cursor: "pointer",
    ":hover": {
      opacity: 0.5,
    },
    marginLeft: 3,
  },
  "redoBig": {
    fontSize: 26,
    cursor: "pointer",
    marginLeft: 15,
    ":hover": {
      opacity: 0.8,
    }
  },
  "checkbox": {
    alignSelf: "center",
    marginRight: 5,
  },
  "header": {
    display: "flex",
    justifyContent: "space-between",
  },
  "title": {
    fontSize: 30,
    fontWeight: 500,
  },
  "multiSelect": {
    borderRadius: 2,
    width: "100%",
    boxSizing: "border-box",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    height: 38,
    display: "flex",
    alignItems: "center",
  },
  "multiSelectSticky": {
    position: "fixed",
    zIndex: 2,
    margin: 0,
    width: 1200,
    // border: `1px solid ${colors.NEW_BLUE()}`,
  },
  "activeDetailsRow": {
    padding: "6px 11px 6px 14px",
    alignItems: "center",
    display: "flex",
    borderRadius: 2,
    background: colors.LIGHTER_GREY(),
    justifyContent: "space-between",
    fontSize: 14,
    width: "100%",
  },
  "dashboardContainer": {
    padding: "0 32px",
    maxWidth: 1200,
  },
  "filters": {
    display: "flex",
    justifyContent: "space-between",
  },
  "inputOverride": {
    minHeight: "unset",
  },
  "dropdown": {
    minHeight: "unset",
    margin: 0,
  },
  "filter": {
    display: "flex",
    width: 200,
    marginLeft: 15,
  },
  "bulkActions": {
    transition: "0.2s",
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
  },
  "bulkAction": {
    marginLeft: 5,
    display: "flex",
  },
  "noResults": {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(0.5)
  },
  "bulkActionRemove": {
    color: colors.RED(),
    cursor: "pointer",
  },
  "bulkActionApprove": {

  },
  "checkIcon": {
    border: "1px solid rgba(36, 31, 58, 0.1)",
    color: colors.GREEN(),
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    cursor: "pointer",
    width: 14,
    height: 14,
    maxHeight: 14,
    maxWidth: 14,
    minWidth: 14,
    minHeight: 14,
    fontSize: 13,
    padding: 5,
    borderRadius: "50%",
    ":hover": {
      color: "rgba(36, 31, 58, 0.8)",
      backgroundColor: "#EDEDF0",
      borderColor: "#d8d8de",
    },
  },
  "bulkActionIcon": {
    marginRight: 10,
  },
  "actionText": {
    marginLeft: 5,
    textDecoration: "underline",
  },
  "resultsContainer": {
  },
  "avatarContainer": {
    marginRight: 8,
  },
  "flagAndRemove": {
    color: colors.RED(),
    cursor: "pointer",
    fontWeight: 500,
    ":hover": {
      textDecoration: "underline",
    }
  },
  "numSelected": {
    marginRight: 10,
  },
  "pageLoader": {
    marginTop: 150,
  },
  "actionDetailsRow": {
    display: "flex",
    marginBottom: 15,
    alignItems: "center",
    fontSize: 14,
  },
  "verdictActionDetailsRow": {
    marginBottom: 6,
  },
  "icon": {
    fontSize: 14,
    color: colors.BLACK(0.75),
    marginLeft: 3,
    marginRight: 3,
  },
  "actionContainer": {
  },
  "flagText": {
  },
  "reason": {
    fontWeight: 500,
  },
  "dot": {
    color: colors.BLACK(0.5),
    whiteSpace: "pre",
  },  
  "timestamp": {
    color: colors.BLACK(0.5),
  },
  "trashIcon": {
    fontSize: 16,
  },
  "timelineSeperator": {
    background: colors.GREY(),
    height: 8,
    width: 4,
    borderRadius: 5,
    marginLeft: 8,
    marginBottom: 5,
  }
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

const mapStateToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(FlaggedContentDashboard);
