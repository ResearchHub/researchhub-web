import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback, useRef, createRef } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID, parseAuthorProfile, parseUnifiedDocument } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchAuditContributions from "./config/fetchAuditContributions";
import CheckBox from "~/components/Form/CheckBox";
import AuthorAvatar from "../AuthorAvatar";
import renderContributionEntry from "./utils/renderEntry";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";


export function AuditContentDashboard() : ReactElement<"div"> {
  const router = useRouter();
  const flagAndRemoveRef = useRef(null);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? {label: "All", value: undefined}
  );

  const [results, setResults] = useState<any>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<[]>>([]);
  

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id === router.query.hub_id)
    setSelectedHub(selected);
  }, [suggestedHubs])

  useEffect(() => {
    fetchAuditContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        hub_id: selectedHub?.id,
      },
      onSuccess: (response) => {
        setResults(response.results);
        setNextResultsUrl(response.next);
      }
    })    
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

  const resultCards = () => {
    return results.map((r) => {
      return (
        <div className={css(styles.result)}>
          <div className={`${css(styles.checkbox)} cbx`}>
            <CheckBox
              key={`${r.content_type}-${r.id}`}
              label=""
              isSquare
              id={r.item.id}
              active={selectedResultIds.includes(r.item.id)}
              onChange={(id) => handleResultSelect(id)}
              labelStyle={undefined}
            />          
          </div>
          <div className={css(styles.entry)}>
            <div className={css(styles.avatarContainer)}>
              <AuthorAvatar author={r.created_by.author_profile} />
            </div>
            {renderContributionEntry(r)}
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
      <div className={css(styles.detailsRow)}>
        <div className={css(styles.bulkActions)}>
          {selectedResultIds.length > 0 &&
            <div className={css(styles.bulkAction, styles.removeAction)} ref={flagAndRemoveRef}>
              <span className={css(styles.bulkActionIcon)}>{icons.trash}</span>
              Flag &amp; Remove  
            </div>
          }
        </div>
      </div>
      <div className={css(styles.resultsContainer)}>
        {resultCards()}
      </div>
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
    minHeight: 50,
    background: "white",
    border: "1px solid black",
    width: "100%",
    display: "flex",
    userSelect: "none",
  },
  "entryContent": {
  },
  "checkbox": {
    alignSelf: "center",
  },
  "header": {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: 40,
  },
  "title": {
    fontSize: 30,
    fontWeight: 500,
  },
  "detailsRow": {
    paddingLeft: 40,
  }, 
  "dashboardContainer": {
    padding: "0 32px",
    maxWidth: 1280,
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
    height: 33,
    marginTop: 10,
    transition: "0.2s",
  },
  "bulkAction": {
    fontSize: 14,
    cursor: "pointer",
  },
  "removeAction": {
    background: colors.RED(),
    padding: "8px 12px",
    color: "white",
    borderRadius: 4,
    display: "inline-block",
  },
  "bulkActionIcon": {
    marginRight: 10,
  },
  "resultsContainer": {
    marginTop: 15,
  },
  "undoRemove": {
    color: "green"
  },
  "avatarContainer": {

  }
});