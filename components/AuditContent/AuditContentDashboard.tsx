import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback, useRef, createRef } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchAuditContributions from "./api/fetchAuditContributionsAPI";
import flagAndRemove, { buildParamsForFlagAndRemoveAPI } from "./api/flagAndRemoveAPI";
import CheckBox from "~/components/Form/CheckBox";
import renderContributionEntry from "./utils/renderContributionEntry";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import { Contribution, parseContribution } from "~/config/types/contribution";
import LoadMoreButton from "../LoadMoreButton";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import { FLAG_REASON } from "../Flag/config/constants";
import { KeyOf } from "~/config/types/root_types";
import Loader from "../Loader/Loader";
import { ApiFilters } from './api/fetchAuditContributionsAPI';

function AuditContentDashboard({ showMessage, setMessage }) : ReactElement<"div"> {
  const router = useRouter();
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [appliedFilters, setAppliedFilteres] = useState<ApiFilters>({
    hubId: (router.query.hub_id as ID)
  });  
  const [isLoadingMore, setIsLoadingMore] = useState<Boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<Boolean>(false);
  
  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  

  useEffect(() => {
    const appliedFilters = { hubId: (router.query.hub_id as ID)}    
    setAppliedFilteres(appliedFilters);
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
    setAppliedFilteres({ hubId: selected?.id });
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

    setIsLoadingPage(true);
    setSelectedResultIds([]);
    setAppliedFilteres({ hubId: selectedHub.id });
    loadResults({ hubId: selectedHub.id }, null);

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
    setIsLoadingMore(true);
    fetchAuditContributions({
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
      const cardActions = [{
        html: (
          <FlagButtonV2
            modalHeaderText="Flag and Remove"
            onSubmit={(verdict:KeyOf<typeof FLAG_REASON>) => {
              const apiParams = buildParamsForFlagAndRemoveAPI({ selected:r,  verdict });
              flagAndRemove({
                apiParams,
                onSuccess: () => {
                  setMessage("Content flagged & removed");
                  showMessage({ show: true, error: false });
                },
                onError: () => {
                  setMessage("Failed to flag & remove");
                  showMessage({ show: true, error: true });                  
                },
              });

            }}
            subHeaderText={"hellow there"}
          />        
        ),
        label: "Flag & Remove",
        style: styles.flagAndRemove,
      }]

      return (
        <div className={css(styles.result)} key={r.item.id}>
          <div className={`${css(styles.checkbox)} cbx`}>
            <CheckBox
              key={`${r.contentType}-${r.item.id}`}
              label=""
              isSquare
              // @ts-ignore
              id={r.id}
              active={selectedResultIds.includes(r.item.id)}
              onChange={(id) => handleResultSelect(id)}
              labelStyle={undefined}
            />          
          </div>
          <div className={css(styles.entry)}>
            {renderContributionEntry(r, cardActions)}
          </div>
        </div>
      )
    })
  }

  const selectedHub = suggestedHubs.find(h => String(appliedFilters.hubId) === String(h.id)) || {"label": "All", id: undefined, value: undefined};
  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Audit Content
        </div>
        <div className={css(styles.filters)}>
          <div className={css(styles.filter)}>
            <FormSelect
              containerStyle={styles.hubDropdown}
              inputStyle={styles.inputOverride}
              id="hubs"
              label=""
              onChange={(_id: ID, selectedHub: any): void =>
                handleHubFilterChange(selectedHub)
              }
              options={suggestedHubs}
              placeholder=""
              value={selectedHub ?? null}
            />       
          </div>
        </div>
      </div>
      <div className={css(styles.multiSelect, isMultiSelectSticky && styles.multiSelectSticky)} ref={multiSelectRef}>
        {selectedResultIds.length > 0 &&
          <div className={css(styles.activeDetailsRow)}>
            <span className={css(styles.numSelected)}>{selectedResultIds.length} selected.</span>
            <div className={css(styles.bulkActions)}>
              <span className={css(styles.bulkAction, styles.bulkActionRemove)}>{icons.flagOutline}<span className={css(styles.actionText)}>Flag &amp; Remove</span></span>
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
    marginBottom: 10,
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
    marginTop: 15,
    marginBottom: 15,
    fontSize: 14,
    height: 44,
  },
  "multiSelectSticky": {
    position: "fixed",
    zIndex: 2,
    margin: 0,
    width: 1200,
    // border: `1px solid ${colors.NEW_BLUE()}`,
  },
  "activeDetailsRow": {
    lineHeight: "22px",
    padding: "10px 10px 10px 17px",
    display: "flex",
    background: colors.LIGHTER_BLUE(),
    justifyContent: "space-between",
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
  "hubDropdown": {
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
  },
  "bulkAction": {

  },
  "noResults": {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(1)
  },
  "bulkActionRemove": {
    color: colors.RED(),
    cursor: "pointer",
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
    marginRight: 15,
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
  }
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

const mapStateToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AuditContentDashboard);
