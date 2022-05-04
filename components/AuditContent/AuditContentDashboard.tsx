import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchAuditContributions from "./config/fetchAuditContributions";
import CheckBox from "~/components/Form/CheckBox";

export function AuditContentDashboard() : ReactElement<"div"> {
  const router = useRouter();

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [results, setResults] = useState<any>([]);
  const [resultCount, setResultCount] = useState<number>(0);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [showRemovedOnly, setShowRemovedOnly] = useState<any>(
    router.query.is_removed ?? false
  );
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? null
  );
  const [selectedResultIds, setSelectedResultIds] = useState<Array<[]>>([]);

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id)
    setSelectedHub(selected);
  }, [suggestedHubs])

  useEffect(() => {
    fetchAuditContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        is_removed: showRemovedOnly,
        hub_id: selectedHub?.id,
      },
      onSuccess: (response) => {
        setResults(response.results);
        setResultCount(response.count);
        setNextResultsUrl(response.next);
      }
    })    
  }, [])

  useEffectFetchSuggestedHubs({ setSuggestedHubs });
  
  const handleRemovedFilterChange = (id, value) => {
    let query = {
      ...router.query,
      is_removed: value,
    };

    setShowRemovedOnly(value);

    router.push({
      query,
    });
  }

  const handleHubFilterChange = (selectedHub: any) => {
    let query = {
      ...router.query,
      hub_id: selectedHub.id,
    };

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
  console.log('selectedResultIds', selectedResultIds)

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
          Audit Content
        </div>
        {process.browser &&
          <div className={css(styles.filters)}>
            <div className={css(styles.filter)}>
              <CheckBox
                label={"Removed only"}
                isSquare
                active={showRemovedOnly}
                onChange={handleRemovedFilterChange}
                labelStyle={undefined}
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
            {showRemovedOnly ? (
              <div className={css(styles.bulkAction, styles.undoRemove)}>  
                Undo remove
              </div>
            ) : (
              <div className={css(styles.bulkAction)}>  
                Flag &amp; Remove
              </div>
            )
            }
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
  },
  "title": {
    fontSize: 30,
    fontWeight: 500,
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
  },
  "resultsContainer": {
    marginTop: 15,
  },
  "bulkActions": {
    marginTop: 10,
    fontSize: 14,
    color: "red",
    textDecoration: "underline",
    cursor: "pointer",
  },
  "undoRemove": {
    color: "green"
  }
});