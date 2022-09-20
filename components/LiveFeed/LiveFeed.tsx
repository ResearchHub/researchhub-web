import { ApiFilters } from "./api/fetchAuditContributionsAPI";
import { Contribution, parseContribution } from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { FLAG_REASON } from "../Flag/config/flag_constants";
import { ID } from "~/config/types/root_types";
import { KeyOf } from "~/config/types/root_types";
import { ReactElement, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import CheckBox from "~/components/Form/CheckBox";
import colors from "~/config/themes/colors";
import fetchAuditContributions from "./api/fetchAuditContributionsAPI";
import flagAndRemove, {
  buildParamsForFlagAndRemoveAPI,
} from "./api/flagAndRemoveAPI";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import FormSelect from "~/components/Form/FormSelect";
import icons from "~/config/themes/icons";
import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import Loader from "../Loader/Loader";
import LoadMoreButton from "../LoadMoreButton";
import renderContributionEntry from "./utils/renderContributionEntry";

export default function LiveFeed({ hub, isHomePage }): ReactElement<"div"> {

  const router = useRouter();
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: hub?.id as ID,
  });
  const [isLoadingMore, setIsLoadingMore] = useState<Boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<Boolean>(true);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  const [hubsDropdownOpenForKey, setHubsDropdownOpenForKey] =
    useState<any>(false);

  useEffect(() => {
    let appliedFilters = { hubId: null }  
    if (hub?.id) {
      appliedFilters = { hubId: hub.id }
    }
    console.log('appliedFilters', appliedFilters)
    setAppliedFilters(appliedFilters);
    loadResults(appliedFilters, null);
  }, [hub, isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isClickOutsideCheckbox(event, [multiSelectRef.current])) {
        setSelectedResultIds([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [selectedResultIds]);

  const handleWindowScroll = () => {
    const navEl: HTMLElement | null = document.querySelector(".navbar");
    const multiSelectEl: HTMLElement | null = multiSelectRef.current;
    if (
      multiSelectEl &&
      // @ts-ignore
      window.scrollY > navEl.clientHeight &&
      selectedResultIds.length > 0
    ) {
      // @ts-ignore
      multiSelectEl.style.top = navEl?.clientHeight + 1 + "px";
      setIsMultiSelectSticky(true);
    } else {
      setIsMultiSelectSticky(false);
    }
  };

  const handleResultSelect = (selectedId) => {
    if (selectedResultIds.includes(selectedId)) {
      setSelectedResultIds(selectedResultIds.filter((id) => id !== selectedId));
    } else {
      setSelectedResultIds([...selectedResultIds, selectedId]);
    }
  };

  const loadResults = (filters: ApiFilters, url = null) => {
    if (!url) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingMore(true);
    }

    fetchAuditContributions({
      pageUrl: url,
      filters,
      onSuccess: (response: any) => {
        const incomingResults = response.results.map((r) =>
          parseContribution(r)
        );
        if (url) {
          setResults([...results, ...incomingResults]);
        } else {
          setResults(incomingResults);
        }

        setNextResultsUrl(response.next);
        setIsLoadingMore(false);
        setIsLoadingPage(false);
      },
    });
  };

  const resultCards = () => {
    return results.map((r) => {
      const cardActions = [
        {
          html: (
            <FlagButtonV2
              modalHeaderText="Flag and Remove"
              flagIconOverride={styles.flagIcon}
              iconOverride={icons.trashSolid}
              errorMsgText="Failed to flag & remove"
              successMsgText="Content flagged & removed"
              primaryButtonLabel="Remove content"
              subHeaderText="I am removing this content because of:"
              onSubmit={(
                verdict: KeyOf<typeof FLAG_REASON>,
                renderErrorMsg,
                renderSuccessMsg
              ) => {
                const apiParams = buildParamsForFlagAndRemoveAPI({
                  selected: r,
                  verdict,
                  isRemoved: true,
                });
                flagAndRemove({
                  apiParams,
                  onError: (error: Error) => {
                    renderErrorMsg(error);
                  },
                  onSuccess: () => {
                    renderSuccessMsg();
                    setResults(
                      results.filter((res) => res.item.id !== r.item.id)
                    );
                  },
                });
              }}
            />
          ),
          label: "Flag & Remove",
          style: styles.flagAndRemove,
          isActive: true,
        },{
          isActive: true,          
          html: (
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
          )
      }];

      return (
        <div className={css(styles.result)} key={r.item.id}>
          <div className={css(styles.entry)}>
            {renderContributionEntry(
              r,
              cardActions,
              setHubsDropdownOpenForKey,
              hubsDropdownOpenForKey
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
    {selectedResultIds.length > 0 && (
      <div
        className={css(
          styles.multiSelect,
          isMultiSelectSticky && styles.multiSelectSticky
        )}
        ref={multiSelectRef}
      >
          <div className={css(styles.activeDetailsRow)}>
            <span className={css(styles.numSelected)}>
              {selectedResultIds.length} selected.
            </span>
            <div className={css(styles.bulkActions)}>
              <span className={css(styles.bulkAction, styles.bulkActionRemove)}>
                <FlagButtonV2
                  modalHeaderText="Flag and Remove"
                  flagIconOverride={styles.flagIcon}
                  iconOverride={icons.trashSolid}
                  primaryButtonLabel="Remove content"
                  onSubmit={(
                    verdict: KeyOf<typeof FLAG_REASON>,
                    renderErrorMsg,
                    renderSuccessMsg
                  ) => {
                    const apiParams = buildParamsForFlagAndRemoveAPI({
                      selected: results.filter((r) =>
                        selectedResultIds.includes(r.item.id)
                      ),
                      verdict,
                      isRemoved: true,
                    });

                    flagAndRemove({
                      apiParams,
                      onSuccess: () => {
                        renderSuccessMsg();
                        setResults(
                          results.filter(
                            (res) => !selectedResultIds.includes(res.item.id)
                          )
                        );
                        setSelectedResultIds([]);
                      },
                      onError: renderErrorMsg,
                    });
                  }}
                />
              </span>
            </div>
          </div>
      </div>
      )}
      {isLoadingPage ? (
        <Loader
          containerStyle={styles.pageLoader}
          key={"loader"}
          loading={true}
          size={45}
          color={colors.NEW_BLUE()}
        />
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0 ? (
              resultCards()
            ) : (
              <div className={css(styles.noResults)}>No results.</div>
            )}
          </div>
          {nextResultsUrl && (
            <LoadMoreButton
              onClick={() => {
                setIsLoadingMore(true);
                loadResults(appliedFilters, nextResultsUrl);
              }}
              // @ts-ignore
              isLoadingMore={isLoadingMore}
            />
          )}
        </>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  result: {
    display: "flex",
    marginBottom: 15,
  },
  entry: {
    // borderRadius: 4,
    // border: `1px solid ${colors.GREY(0.5)}`,
    // background: "white",
    // padding: 15,
    width: "100%",
    display: "flex",
    userSelect: "none",
  },
  redo: {
    fontSize: 17,
    cursor: "pointer",
    color: colors.BLACK(0.5),
    alignSelf: "center",
    marginLeft: 15,
    ":hover": {
      opacity: 0.5,
    },
  },
  flagIcon: {
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
      backgroundColor: "#EDEDF0",
      color: "rgba(36, 31, 58, 0.8)",
    },
  },
  checkbox: {
    alignSelf: "center",
    marginRight: 5,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    display: "flex",
  },
  multiSelect: {
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
  multiSelectSticky: {
    position: "fixed",
    zIndex: 2,
    margin: 0,
    width: 1200,
    // border: `1px solid ${colors.NEW_BLUE()}`,
  },
  activeDetailsRow: {
    padding: "6px 11px 6px 14px",
    alignItems: "center",
    display: "flex",
    borderRadius: 2,
    background: colors.LIGHTER_GREY(),
    justifyContent: "space-between",
    fontSize: 14,
    width: "100%",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputOverride: {
    minHeight: "unset",
  },
  hubDropdown: {
    minHeight: "unset",
    margin: 0,
  },
  filter: {
    display: "flex",
    width: 200,
    marginLeft: 15,
  },
  bulkActions: {
    transition: "0.2s",
    fontSize: 14,
    fontWeight: 500,
  },
  bulkAction: {
    display: "flex",
  },
  noResults: {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(0.5),
  },
  bulkActionRemove: {
    color: colors.RED(),
    cursor: "pointer",
  },
  bulkActionIcon: {
    marginRight: 10,
  },
  actionText: {
    marginLeft: 5,
    textDecoration: "underline",
  },
  resultsContainer: {},
  avatarContainer: {
    marginRight: 15,
  },
  flagAndRemove: {
    color: colors.RED(),
    cursor: "pointer",
    fontWeight: 500,
    ":hover": {
      textDecoration: "underline",
    },
  },
  numSelected: {
    marginRight: 10,
  },
  pageLoader: {
    marginTop: 150,
  },
});
