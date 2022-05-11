import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useRef } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchFlaggedContributions from "./config/fetchFlaggedContributions";
import CheckBox from "~/components/Form/CheckBox";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import AuthorAvatar from "../AuthorAvatar";
import renderContributionEntry from "./utils/renderContributionEntry";
import { FlaggedContribution, parseFlaggedContribution } from "~/config/types/flag";
import ALink from "../ALink";
import { timeSince } from "~/config/utils/dates";

const visibilityOpts = [{
  "label": "Open",
  "value": "open"
}, {
  "label": "Approved",
  "value": "approved"  
}, {
  "label": "Removed",
  "value": "removed"    
}];

export function FlaggedContentDashboard() : ReactElement<"div"> {
  const router = useRouter();
  const flagAndRemoveRef = useRef(null);
  const approveRef = useRef(null);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? {label: "All", value: undefined}
  );
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [results, setResults] = useState<Array<FlaggedContribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  
  const [selectedVisibility, setSelectedVisibility] = useState<any>(
    router.query.visibility ?? visibilityOpts[0]
  );

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
    const handleClickOutside = (event) => {
      const isOutsideClick = isClickOutsideCheckbox(event, [flagAndRemoveRef.current, approveRef.current]);

      if (isOutsideClick) {
        setSelectedResultIds([]);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [])


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

    fetchFlaggedContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        hubId: selectedHub?.id,
      },
      onSuccess: (response) => {
        const incomingResults = response.results.map(r => parseFlaggedContribution(r))
        setResults([...results, ...incomingResults]);
        setNextResultsUrl(response.next);
        setIsLoading(false);
      }
    })
  }  

  const resultCards = () => {
    const cardActions = [{
      icon: icons.trashSolid,
      label: "Remove content",
      onClick: () => alert('flag & remove'),
      style: styles.flagAndRemove,
    }, {
      icon: icons.check,
      label: "Content looks OK",
      onClick: () => alert('LOOKS OK'),
      style: styles.looksOk,
    }]

    return results.map((r) => {
      return (
        <div className={css(styles.result)} key={r.id}>
          <div className={css(styles.actionDetailsRow)}>
            <div className={css(styles.avatarContainer)}>
              <AuthorAvatar size={25} author={r.flaggedBy.authorProfile} />
            </div>
            <span className={css(styles.actionContainer)}>
              <ALink href={`/user/${r.flaggedBy.authorProfile.id}/overview`}>{r.flaggedBy.authorProfile.firstName} {r.flaggedBy.authorProfile.lastName}</ALink>
              <span className={css(styles.icon)}>&nbsp;{icons.flagOutline}</span>
              <span className={css(styles.flagText)}>&nbsp;flagged this content as <span className={css(styles.reason)}>{r.reason}</span></span>
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
        <div className={css(styles.bulkActions)}>
          {selectedResultIds.length > 0 &&
            <>
              <div className={css(styles.bulkAction, styles.approveAction)} ref={approveRef}>
                <span className={css(styles.bulkActionIcon)}>{icons.check}</span>
                Approve  
              </div>          
              <div className={css(styles.bulkAction, styles.removeAction)} ref={flagAndRemoveRef}>
                <span className={css(styles.bulkActionIcon)}>{icons.trash}</span>
                Remove  
              </div>
            </>
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
  "entryContainer": {
    display: "flex",
  },
  "icon": {
    fontSize: 14,
    color: colors.BLACK(0.75),
    marginLeft: 3,
    marginRight: 3,
  },
  "actionDetailsRow": {
    display: "flex",
    marginBottom: 10,
    alignItems: "center",
  },
  "actionContainer": {
  },
  "flagText": {
  },
  "result": {
    marginBottom: 15,
    fontSize: 14,
  },
  "reason": {
    fontWeight: 500,
  },
  "timestamp": {
    color: colors.BLACK(0.5),
  },
  "dot": {
    color: colors.BLACK(0.5),
    whiteSpace: "pre",
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
  "entryContent": {
  },
  "checkbox": {
    alignSelf: "center",
    marginRight: 5,
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
    display: "inline-block",
    borderRadius: 4,
    marginRight: 10,
  },
  "removeAction": {
    background: colors.RED(),
    padding: "8px 12px",
    color: "white",
  },
  "approveAction": {
    background: colors.GREEN(),
    padding: "8px 12px",
    color: "black",
  },
  "bulkActionIcon": {
    marginRight: 10,
  },
  "resultsContainer": {
    marginTop: 15,
  },
  "avatarContainer": {
    marginRight: 8,
  },
  "flagAndRemove": {
    color: colors.RED(),
    cursor: "pointer",
    padding: 10,
    fontSize:20,
  },
  "looksOk": {
    color: colors.GREEN(),
    cursor: "pointer",
    padding: 10,
    fontSize:20,
  }
});