import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import CheckBox from "~/components/Form/CheckBox";

export function AuditContentDashboard() : ReactElement<"div"> {
  const router = useRouter();

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [showRemovedOnly, setShowRemovedOnly] = useState<any>(
    router.query.is_removed ?? false
  );
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? null
  );

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id)
    setSelectedHub(selected);
  }, [suggestedHubs])

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
  console.log(showRemovedOnly)
  console.log(typeof showRemovedOnly)
  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Audit Content
        </div>
        {process.browser &&
          <div className={css(styles.filters)}>
            <div className={css(styles.filter)}>
              <CheckBox label="Removed only" isSquare active={showRemovedOnly} onChange={handleRemovedFilterChange}  />
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
      </div>
      <div className={css(styles.resultsContainer)}>
        
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  "header": {
    display: "flex",
  },
  "title": {
    fontSize: 30,
    fontWeight: 500,
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
  }
});