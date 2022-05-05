import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchFlaggedContributions from "./config/fetchFlaggedContributions";
import CheckBox from "~/components/Form/CheckBox";

const visibilityOpts = [{
  "label": "Flagged",
  "value": "flagged"
}, {
  "label": "Reviewed",
  "value": "reviewed"  
}];

export function FlaggedContentDashboard() : ReactElement<"div"> {
  const router = useRouter();

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [results, setResults] = useState<any>([]);
  const [resultCount, setResultCount] = useState<number>(0);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? {label: "All", value: undefined}
  );
  const [selectedVisibility, setSelectedVisibility] = useState<any>(
    router.query.visibility ?? visibilityOpts[0]
  );
  const [selectedResultIds, setSelectedResultIds] = useState<Array<[]>>([]);

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id === router.query.hub_id)
    setSelectedHub(selected);
  }, [suggestedHubs])

  useEffect(() => {
    fetchFlaggedContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        visibility: selectedVisibility,
        hub_id: selectedHub?.id,
      },
      onSuccess: (response) => {
        setResults(response.results);
        setResultCount(response.count);
        setNextResultsUrl(response.next);
      }
    })    
  }, [])

  useEffectFetchSuggestedHubs({ setSuggestedHubs: (hubs) => {
    setSuggestedHubs([{label: "All", value: undefined}, ...hubs])
  } });

  const handleVisibilityFilterChange = (selectedVisibility: any) => {
    let query = {
      ...router.query,
      visibility: selectedVisibility.value,
    };

    setSelectedVisibility(selectedVisibility);

    router.push({
      query,
    });
  }

  const handleHubFilterChange = (selectedHub: any) => {

    let query = { ...router.query }
    if (selectedHub.value) {
      query.hub_id = selectedHub.id;
    }
    else {
      delete query.hub_id;    
    }

    setSelectedHub(selectedHub)

    router.push({
      query,
    });
  }

  const handleResultSelect = (selectedId) => {
    if (selectedResultIds.includes(selectedId)) {
      console.log('delete', selectedId)
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
        <div className={css(resultsStyles.result)}>
          <div className={css(resultsStyles.checkbox)}>
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
          <div className={css(resultsStyles.content)}></div>
        </div>
      )
    })
  }

  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Flagged Content
        </div>
        {process.browser &&
          <div className={css(styles.filters)}>
            <div className={css(styles.filter)}>
              <FormSelect
                containerStyle={styles.hubDropdown}
                inputStyle={styles.inputOverride}
                id="visibility"
                label=""
                onChange={(_id: ID, selectedVisibility: any): void =>
                  handleVisibilityFilterChange(selectedVisibility)
                }
                options={visibilityOpts}
                placeholder=""
                value={selectedVisibility}
              />
            </div>
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
                placeholder="Search Hubs"
                value={selectedHub ?? null}
              />       
            </div>
          </div>
        }
      </div>
      <div className={css(styles.detailsRow)}>
        {resultCount} results.
        {selectedResultIds.length > 0 &&
          <div className={css(styles.bulkActions)}>
            {selectedVisibility?.value === "flagged" && (
              <div className={css(styles.bulkAction, styles.markReviewed)}>
                Mark reviewed
              </div>
            )}
          </div>
          }
        </div>
      <div className={css(styles.resultsContainer)}>
        {resultCards()}
      </div>
    </div>
  )
}

const resultsStyles = StyleSheet.create({
  "result": {
    minHeight: 50,
    display: "flex",
    marginBottom: 10,
  },
  "content": {
    background: "white",
    border: "1px solid black",
    width: "100%",
  },
  "checkbox": {
    alignSelf: "center",
  }
})

const styles = StyleSheet.create({
  "header": {
    display: "flex",
    justifyContent: "space-between",
  },
  "title": {
    fontSize: 30,
    fontWeight: 500,
    justifyContent: "space-between",
  },
  "detailsRow": {
    padding: "10px 0",
  }, 
  "dashboardContainer": {
    padding: "0 32px",
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
  "resultsContainer": {
    marginTop: 15,
  },
  "bulkActions": {
    fontSize: 14,
    color: "red",
    textDecoration: "underline",
    cursor: "pointer",
  },
  "markReviewed": {
    marginTop: 10,
    color: "green"
  }
});