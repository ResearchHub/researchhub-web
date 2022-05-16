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

function FlaggedContentDashboard({ showMessage, setMessage }) : ReactElement<"div"> {
  const router = useRouter();
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: (router.query.hub_id as ID),
    verdict: (router.query.verdict as string),
  });  
  const [isLoadingMore, setIsLoadingMore] = useState<Boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<Boolean>(true);
  
  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  

  useEffect(() => {
    const appliedFilters = {
      hubId: (router.query.hub_id as ID),
      verdict: (router.query.verdict as string),
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
  }, []);

  useEffectFetchSuggestedHubs({ setSuggestedHubs: (hubs) => {
    setSuggestedHubs([{label: "All", value: undefined}, ...hubs])
    const selected = hubs.find(h => String(h.id) === String(router.query.hub_id))
    setAppliedFilters({...appliedFilters, hubId: selected?.id});
  } });

  const handleWindowScroll = () => {
    const navEl:(HTMLElement|null) = document.querySelector(".navbar");
    const multiSelectEl:HTMLElement|null = multiSelectRef.current;
    // @ts-ignore
    if (multiSelectEl && window.scrollY > navEl.clientHeight) {
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
            onSubmit={(verdict: KeyOf<typeof FLAG_REASON>) => {
              const apiParams = buildParamsForFlagAndRemoveAPI({ selected: r, verdict });
              flagAndRemove({
                apiParams,
                onSuccess: () => {
                  setMessage("Content flagged & removed");
                  showMessage({ show: true, error: false });
                  setResults(results.filter(res => res.item.id !== r.item.id));
                },
                onError: () => {
                  setMessage("Failed to flag & remove");
                  showMessage({ show: true, error: true });
                },
              });
            } }
            subHeaderText={"hellow there"}
          />
        ),
        label: "Remove Content",
        style: styles.flagAndRemove,
        isActive: appliedFilters.verdict === "OPEN",
      }, {
        html: (
          <span className={css(styles.bulkAction, styles.checkIcon, styles.bulkActionApprove)}>
            {icons.check}
          </span>
        ),
        label: "Dismiss Flag",
        // style: styles.flagAndRemove,
        isActive: appliedFilters.verdict === "OPEN",
      }]

      return (
        <div className={css(styles.result)} key={r.item.id}>
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
                    <span className={css(styles.icon, styles.trashIcon)}>&nbsp;{icons.trash}</span>
                    {/* @ts-ignore */}
                    &nbsp;removed this content due to <span className={css(styles.reason)}>{FLAG_REASON[r.verdict.verdictChoice]}</span>
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
                key={`${r.contentType}-${r.item.id}`}
                label=""
                isSquare
                // @ts-ignore
                id={r.item.id}
                active={selectedResultIds.includes(r.item.id)}
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
              <span className={css(styles.bulkAction, styles.bulkActionRemove)}>
                <FlagButtonV2
                  modalHeaderText="Flag and Remove"
                  flagIconOverride={styles.flagIcon}
                  onSubmit={(verdict:KeyOf<typeof FLAG_REASON>) => {
                    console.log('flag and remove')
                  }}
                  subHeaderText={"hellow there"}
                />                
              </span>
              <span className={css(styles.bulkAction, styles.checkIcon, styles.bulkActionApprove)}>
                {icons.check}
              </span>
            </div>
          </div>
        }
      </div>
      {isLoadingPage ? (
        <Loader containerStyle={styles.pageLoader} key={"loader"} loading={true} size={45} color={colors.NEW_BLUE()} />
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0
              ? resultCards()
              : <div className={css(styles.noResults)}>No results.</div>
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
    // background: colors.RED(0.1),
    color: colors.RED(0.6),
    ":hover": {
      // background: colors.RED(0.1),
      color: colors.RED(0.6),      
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




























// import { css, StyleSheet } from "aphrodite";
// import { ReactElement, useState, useEffect, useRef } from "react";
// import FormSelect from "~/components/Form/FormSelect";
// import { useRouter } from "next/router";
// import { ID } from "~/config/types/root_types";
// import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
// import fetchFlaggedContributions from "./api/fetchFlaggedContributionsAPI";
// import CheckBox from "~/components/Form/CheckBox";
// import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
// import icons from "~/config/themes/icons";
// import colors from "~/config/themes/colors";
// import AuthorAvatar from "../AuthorAvatar";
// import renderContributionEntry from "./utils/renderContributionEntry";
// import { FlaggedContribution, parseFlaggedContribution } from "~/config/types/flag";
// import ALink from "../ALink";
// import { timeSince } from "~/config/utils/dates";

// const visibilityOpts = [{
//   "label": "Open",
//   "value": "open"
// }, {
//   "label": "Approved",
//   "value": "approved"  
// }, {
//   "label": "Removed",
//   "value": "removed"    
// }];

// export function FlaggedContentDashboard() : ReactElement<"div"> {
//   const router = useRouter();
//   const flagAndRemoveRef = useRef(null);
//   const approveRef = useRef(null);

//   const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
//   const [selectedHub, setSelectedHub] = useState<any>(
//     router.query.hub_id ?? {label: "All", value: undefined}
//   );
//   const [isLoading, setIsLoading] = useState<Boolean>(false);

//   const [results, setResults] = useState<Array<FlaggedContribution>>([]);
//   const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
//   const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  
//   const [selectedVisibility, setSelectedVisibility] = useState<any>(
//     router.query.visibility ?? visibilityOpts[0]
//   );

//   useEffect(() => {
//     const selected = suggestedHubs.find(h => h.id === router.query.hub_id)
//     setSelectedHub(selected);
//   }, [suggestedHubs])

//   useEffect(() => {
//     handleLoadResults();
//   }, [])

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isOutsideClick = isClickOutsideCheckbox(event, [flagAndRemoveRef.current]);

//       if (isOutsideClick) {
//         setSelectedResultIds([]);
//       }
//     }

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [])

//   useEffectFetchSuggestedHubs({ setSuggestedHubs: (hubs) => {
//     setSuggestedHubs([{label: "All", value: undefined}, ...hubs])
//   } });

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isOutsideClick = isClickOutsideCheckbox(event, [flagAndRemoveRef.current, approveRef.current]);

//       if (isOutsideClick) {
//         setSelectedResultIds([]);
//       }
//     }

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [])


//   const handleVisibilityFilterChange = (selectedVisibility: any) => {
//     let query = {
//       ...router.query,
//       visibility: selectedVisibility.value,
//     };

//     setSelectedVisibility(selectedVisibility);

//     router.push({
//       query,
//     });
//   }

//   const handleHubFilterChange = (selectedHub: any) => {

//     let query = { ...router.query }
//     if (selectedHub.value) {
//       query.hub_id = selectedHub.id;
//     }
//     else {
//       delete query.hub_id;    
//     }

//     setSelectedHub(selectedHub)

//     router.push({
//       query,
//     });
//   }

//   const handleResultSelect = (selectedId) => {
//     if (selectedResultIds.includes(selectedId)) {
//       setSelectedResultIds(
//         selectedResultIds.filter(id => id !== selectedId)
//       )
//     }
//     else {
//       setSelectedResultIds([...selectedResultIds, selectedId]);
//     }
//   }

//   const handleLoadResults = () => {
//     setIsLoading(true);

//     fetchFlaggedContributions({
//       pageUrl: nextResultsUrl || null,
//       filters: {
//         hubId: selectedHub?.id,
//       },
//       onSuccess: (response) => {
//         const incomingResults = response.results.map(r => parseFlaggedContribution(r))
//         setResults([...results, ...incomingResults]);
//         setNextResultsUrl(response.next);
//         setIsLoading(false);
//       }
//     })
//   }  

//   const resultCards = () => {
//     const cardActions = [{
//       icon: icons.trashSolid,
//       label: "Remove content",
//       onClick: () => alert('flag & remove'),
//       style: styles.flagAndRemove,
//     }, {
//       icon: icons.check,
//       label: "Content looks OK",
//       onClick: () => alert('LOOKS OK'),
//       style: styles.looksOk,
//     }]

//     return results.map((r) => {
//       return (
//         <div className={css(styles.result)} key={r.id}>
//           <div className={css(styles.actionDetailsRow)}>
//             <div className={css(styles.avatarContainer)}>
//               <AuthorAvatar size={25} author={r.flaggedBy.authorProfile} />
//             </div>
//             <span className={css(styles.actionContainer)}>
//               <ALink href={`/user/${r.flaggedBy.authorProfile.id}/overview`}>{r.flaggedBy.authorProfile.firstName} {r.flaggedBy.authorProfile.lastName}</ALink>
//               <span className={css(styles.icon)}>&nbsp;{icons.flagOutline}</span>
//               <span className={css(styles.flagText)}>&nbsp;flagged this content as <span className={css(styles.reason)}>{r.reason}</span></span>
//             </span>
//             <span className={css(styles.dot)}> • </span>
//             <span className={css(styles.timestamp)}>2 days ago</span>
//           </div>
//           <div className={css(styles.entryContainer)}>
//             <div className={`${css(styles.checkbox)} cbx`}>
//               <CheckBox
//                 key={`${r.contentType}-${r.id}`}
//                 label=""
//                 isSquare
//                 // @ts-ignore
//                 id={r.id}
//                 active={selectedResultIds.includes(r.id)}
//                 onChange={(id) => handleResultSelect(id)}
//                 labelStyle={undefined}
//               />          
//             </div>
//             <div className={css(styles.entry)}>
//               {renderContributionEntry(r, cardActions)}
//             </div>
//           </div>
//         </div>
//       )
//     })
//   }

//   return (
//     <div className={css(styles.dashboardContainer)}>
//       <div className={css(styles.header)}>
//         <div className={css(styles.title)}>
//           Flagged Content
//         </div>
//         {process.browser &&
//           <div className={css(styles.filters)}>
//             <div className={css(styles.filter)}>
//               <FormSelect
//                 containerStyle={styles.dropdown}
//                 inputStyle={styles.inputOverride}
//                 id="visibility"
//                 label=""
//                 onChange={(_id: ID, selectedVisibility: any): void =>
//                   handleVisibilityFilterChange(selectedVisibility)
//                 }
//                 options={visibilityOpts}
//                 placeholder=""
//                 value={selectedVisibility}
//               />
//             </div>
//             <div className={css(styles.filter)}>
//               <FormSelect
//                 containerStyle={styles.dropdown}
//                 inputStyle={styles.inputOverride}
//                 id="hubs"
//                 label=""
//                 onChange={(_id: ID, selectedHub: any): void =>
//                   handleHubFilterChange(selectedHub)
//                 }
//                 options={suggestedHubs}
//                 placeholder="Search Hubs"
//                 value={selectedHub ?? null}
//               />       
//             </div>
//           </div>
//         }
//       </div>
//       <div className={css(styles.detailsRow)}>
//         <div className={css(styles.bulkActions)}>
//           {selectedResultIds.length > 0 &&
//             <>
//               <div className={css(styles.bulkAction, styles.approveAction)} ref={approveRef}>
//                 <span className={css(styles.bulkActionIcon)}>{icons.check}</span>
//                 Approve  
//               </div>          
//               <div className={css(styles.bulkAction, styles.removeAction)} ref={flagAndRemoveRef}>
//                 <span className={css(styles.bulkActionIcon)}>{icons.trash}</span>
//                 Remove  
//               </div>
//             </>
//           }
//         </div>
//       </div>
//       <div className={css(styles.resultsContainer)}>
//         {resultCards()}
//       </div>
//     </div>
//   )
// }


// const styles = StyleSheet.create({
//   "entryContainer": {
//     display: "flex",
//   },
//   "icon": {
//     fontSize: 14,
//     color: colors.BLACK(0.75),
//     marginLeft: 3,
//     marginRight: 3,
//   },
//   "actionContainer": {
//   },
//   "flagText": {
//   },
//   "reason": {
//     fontWeight: 500,
//   },
//   "dot": {
//     color: colors.BLACK(0.5),
//     whiteSpace: "pre",
//   },  
//   "actionDetailsRow": {
//     display: "flex",
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   "result": {
//     marginBottom: 15,
//     fontSize: 14,
//   },
//   "timestamp": {
//     color: colors.BLACK(0.5),
//   },
//   "entry": {
//     borderRadius: 2,  
//     background: "white",
//     border: `1px solid ${colors.GREY()}`,
//     width: "100%",
//     display: "flex",
//     userSelect: "none",
//     padding: 10,
//   },
//   "entryContent": {
//   },
//   "checkbox": {
//     alignSelf: "center",
//     marginRight: 5,
//   },
//   "header": {
//     display: "flex",
//     justifyContent: "space-between",
//     paddingLeft: 40,
//   },
//   "title": {
//     fontSize: 30,
//     fontWeight: 500,
//   },
//   "detailsRow": {
//     paddingLeft: 40,
//   }, 
//   "dashboardContainer": {
//     padding: "0 32px",
//     maxWidth: 1280,
//   },
//   "filters": {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   "inputOverride": {
//     minHeight: "unset",
//   },
//   "dropdown": {
//     minHeight: "unset",
//     margin: 0,
//   },
//   "filter": {
//     display: "flex",
//     width: 200,
//     marginLeft: 15,
//   },
//   "bulkActions": {
//     height: 33,
//     marginTop: 10,
//     transition: "0.2s",
//   },
//   "bulkAction": {
//     fontSize: 14,
//     cursor: "pointer",
//     display: "inline-block",
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   "removeAction": {
//     background: colors.RED(),
//     padding: "8px 12px",
//     color: "white",
//   },
//   "approveAction": {
//     background: colors.GREEN(),
//     padding: "8px 12px",
//     color: "black",
//   },
//   "bulkActionIcon": {
//     marginRight: 10,
//   },
//   "resultsContainer": {
//     marginTop: 15,
//   },
//   "avatarContainer": {
//     marginRight: 8,
//   },
//   "flagAndRemove": {
//     color: colors.RED(),
//     cursor: "pointer",
//     padding: 10,
//     fontSize:20,
//   },
//   "looksOk": {
//     color: colors.GREEN(),
//     cursor: "pointer",
//     padding: 10,
//     fontSize:20,
//   }
// });