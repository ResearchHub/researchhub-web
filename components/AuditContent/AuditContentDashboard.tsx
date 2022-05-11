import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback, useRef, createRef } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchAuditContributions from "./config/fetchAuditContributions";
import CheckBox from "~/components/Form/CheckBox";
import AuthorAvatar from "../AuthorAvatar";
import renderContributionEntry from "./utils/renderContributionEntry";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import { Contribution, parseContribution } from "~/config/types/contribution";
import LoadMoreButton from "../LoadMoreButton";


export function AuditContentDashboard() : ReactElement<"div"> {
  const router = useRouter();
  const flagAndRemoveRef = useRef<HTMLElement>(null);
  const multiSelectRef = useRef<HTMLElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? {label: "All", value: undefined}
  );
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id === router.query.hub_id)
    setSelectedHub(selected);
  }, [suggestedHubs])

  useEffect(() => {
    handleLoadResults();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = isClickOutsideCheckbox(event, [flagAndRemoveRef.current]);

      if (isOutsideClick) {
        setSelectedResultIds([]);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [])

  useEffectFetchSuggestedHubs({ setSuggestedHubs: (hubs) => {
    setSuggestedHubs([{label: "All", value: undefined}, ...hubs])
  } });


  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.addEventListener("scroll", handleWindowScroll);
    }
  }, [])

  
  const handleWindowScroll = () => {
    const navEl:(HTMLElement|null) = document.querySelector(".navbar");
    const multiSelectEl:HTMLElement|null = multiSelectRef.current;

    console.log("navEl.clientHeight", navEl.clientHeight)
    console.log('window.scrollY', window.scrollY)
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
    if (selectedHub.value) {
      query.hub_id = selectedHub.id;
    }
    else {
      delete query.hub_id;    
    }

    setSelectedHub(selectedHub);

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

  const handleLoadResults = () => {
    setIsLoading(true);

    fetchAuditContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        hubId: selectedHub?.id,
      },
      onSuccess: (response) => {
        const incomingResults = response.results.map(r => parseContribution(r))
        setResults([...results, ...incomingResults]);
        setNextResultsUrl(response.next);
        setIsLoading(false);
      }
    })
  }

  const resultCards = () => {
    const cardActions = [{
      icon: icons.flagOutline,
      label: "Flag & Remove",
      onClick: () => alert('flag & remove'),
      style: styles.flagAndRemove,
    }]

    return results.map((r) => {
      return (
        <div className={css(styles.result)} key={r.id}>
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
      )
    })
  }


  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Audit Content
        </div>
        {process.browser &&
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
        }
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
      <div className={css(styles.resultsContainer)}>
        {resultCards()}
      </div>
      {nextResultsUrl && (
        // @ts-ignore
        <LoadMoreButton onClick={handleLoadResults} isLoading={isLoading} />
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
  },
  "activeDetailsRow": {
    lineHeight: "22px",
    padding: "10px 10px 10px 17px",
    display: "flex",
    border: `1px solid ${colors.NEW_BLUE()}`,
    background: colors.LIGHTER_BLUE(),
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
  }
});