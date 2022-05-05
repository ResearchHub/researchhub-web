import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect, useCallback } from "react";
import FormSelect from "~/components/Form/FormSelect";
import { useRouter } from "next/router";
import { ID, parseAuthorProfile, parseUnifiedDocument } from "~/config/types/root_types";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import fetchAuditContributions from "./config/fetchAuditContributions";
import CheckBox from "~/components/Form/CheckBox";
import AuthorAvatar from "../AuthorAvatar";
import ALink from "../ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { timeSince } from "~/config/utils/dates";

const visibilityOpts = [{
  "label": "Live content",
  "value": "live"
}, {
  "label": "Removed only",
  "value": "removed"
}];

export function AuditContentDashboard() : ReactElement<"div"> {
  const router = useRouter();

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [results, setResults] = useState<any>([]);
  const [resultCount, setResultCount] = useState<number>(0);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<any>(
    router.query.visibility ?? visibilityOpts[0]
  );
  const [selectedHub, setSelectedHub] = useState<any>(
    router.query.hub_id ?? {label: "All", value: undefined}
  );
  const [selectedResultIds, setSelectedResultIds] = useState<Array<[]>>([]);

  useEffect(() => {
    const selected = suggestedHubs.find(h => h.id === router.query.hub_id)
    setSelectedHub(selected);
  }, [suggestedHubs])

  useEffect(() => {
    fetchAuditContributions({
      pageUrl: nextResultsUrl || null,
      filters: {
        is_removed: selectedVisibility.value === "removed" ? true : false,
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
          <div className={css(resultsStyles.entry)}>
            <div className={css(styles.avatarContainer)}>
              <AuthorAvatar author={r.created_by.author_profile} />
            </div>
            {renderEntry(r)}
          </div>
        </div>
      )
    })
  }

  const renderEntry = (entry) => {
    const {
      item,
      created_by,
      created_date: createdDate,
      content_type: contentType,
    } = entry;

    const uniDoc = parseUnifiedDocument(item.unified_document)
    const authorProfile = parseAuthorProfile(created_by);
    
    switch (entry.content_type) {
      case "thread":
      case "comment":
      case "reply":
        return (
          <div className={css(resultsStyles.entryContent)}>
            <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
            <ALink href="link-to-comment">commented</ALink>
            <div className={css(resultsStyles.entryContent)}>{item.plain_text}</div>
            <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
            <span>•</span>
            <span>{timeSince(createdDate)}</span>
          </div>
        )
        case "paper":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
              uploaded paper
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
        case "hypothesis":
          return (
            <div className={css(resultsStyles.entryContent)}>
              <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
              created hypothesis
              <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
              <span>•</span>
              <span>{timeSince(createdDate)}</span>
            </div>
          )
          case "researchhubpost":
            return (
              <div className={css(resultsStyles.entryContent)}>
                <ALink href={`/user/${authorProfile.id}/overview`}>{authorProfile.firstName} {authorProfile.lastName}</ALink>
                created post
                <ALink href={getUrlToUniDoc(uniDoc)}>{uniDoc.document?.title}</ALink>
                <span>•</span>
                <span>{timeSince(createdDate)}</span>
              </div>
            )            
    } 
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
                placeholder=""
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
            {selectedVisibility.value === "removed" ? (
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
  },
  "entryContent": {
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
  },
  "detailsRow": {
    padding: "10px 0",
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