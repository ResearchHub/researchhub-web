import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faCheck, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { faFlag } from "@fortawesome/pro-regular-svg-icons";
import fetchFlaggedContributions, {
  ApiFilters,
  verdictOpts,
} from "./api/fetchFlaggedContributionsAPI";
import { connect } from "react-redux";
import { Contribution, parseContribution } from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { FLAG_REASON } from "~/components/Flag/config/flag_constants";
import { ID, KeyOf } from "~/config/types/root_types";
import { MessageActions } from "~/redux/message";
import { NavbarContext } from "~/pages/Base";
import { ReactElement, useState, useEffect, useRef, useContext } from "react";
import { timeSince } from "~/config/utils/dates";
import { useEffectFetchSuggestedHubs } from "~/components/Paper/Upload/api/useEffectGetSuggestedHubs";
import { useRouter } from "next/router";
import ALink from "../ALink";
import AuthorAvatar from "../AuthorAvatar";
import CheckBox from "~/components/Form/CheckBox";
import colors from "~/config/themes/colors";
import dismissFlaggedContent from "./api/dismissFlaggedContentAPI";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import FormSelect from "~/components/Form/FormSelect";

import isClickOutsideCheckbox from "./utils/isClickOutsideCheckbox";
import Loader from "../Loader/Loader";
import LoadMoreButton from "../LoadMoreButton";
import removeFlaggedContent from "./api/removeFlaggedContentAPI";
import ContributionEntry from "./Contribution/ContributionEntry";
import IconButton from "../Icons/IconButton";

function FlaggedContentDashboard({
  setMessage,
  showMessage,
}): ReactElement<"div"> {
  const router = useRouter();
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [isMultiSelectSticky, setIsMultiSelectSticky] = useState(false);

  const [suggestedHubs, setSuggestedHubs] = useState<any>([]);
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: router.query.hub_id as ID,
    verdict: (router.query.verdict as string) || "OPEN",
  });
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<Array<ID>>([]);
  const [hubsDropdownOpenForKey, setHubsDropdownOpenForKey] =
    useState<any>(false);
  const { setNumNavInteractions, numNavInteractions } =
    useContext(NavbarContext);

  useEffect(() => {
    const appliedFilters = {
      hubId: router.query.hub_id as ID,
      verdict: (router.query.verdict as string) || "OPEN",
    };
    setAppliedFilters(appliedFilters);
    loadResults(appliedFilters, null);
  }, [router.query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = isClickOutsideCheckbox(event, [
        multiSelectRef.current,
      ]);

      if (isOutsideClick) {
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

  useEffectFetchSuggestedHubs({
    setSuggestedHubs: (hubs) => {
      setSuggestedHubs([{ label: "All Hubs", value: undefined }, ...hubs]);
      const selected = hubs.find(
        (h) => String(h.id) === String(router.query.hub_id)
      );
      setAppliedFilters({ ...appliedFilters, hubId: selected?.id });
    },
  });

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

  const handleHubFilterChange = (selectedHub: any) => {
    const query = { ...router.query };
    if (selectedHub.id) {
      query.hub_id = selectedHub.id;
    } else {
      delete query.hub_id;
    }

    const newFilters = {
      ...appliedFilters,
      hubId: selectedHub.id,
    };

    setIsLoadingPage(true);
    setSelectedResultIds([]);
    setAppliedFilters(newFilters);
    loadResults(newFilters, null);

    router.push({
      query,
    });
  };

  const handleVerdictChange = (selectedVerdict: any) => {
    const query = { ...router.query };
    if (selectedVerdict.value) {
      query.verdict = selectedVerdict.value;
    } else {
      delete query.verdict;
    }

    const newFilters = {
      ...appliedFilters,
      verdict: selectedVerdict.value,
    };

    setIsLoadingPage(true);
    setSelectedResultIds([]);
    setAppliedFilters(newFilters);
    loadResults(newFilters, null);

    router.push({
      query,
    });
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

    fetchFlaggedContributions({
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
      const isOneLineAction =
        r?.flaggedBy &&
        r?.flaggedBy?.authorProfile?.id ===
          r?.verdict?.createdBy?.authorProfile?.id;

      const cardActions = [
        {
          html: (
            <FlagButtonV2
              modalHeaderText="Flag and Remove"
              flagIconOverride={styles.flagIcon}
              iconOverride={<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
              defaultReason={r.reason}
              successMsgText="Flagged Content removed"
              errorMsgText="Failed to remove flagged content"
              subHeaderText="I am removing this content because of:"
              primaryButtonLabel="Remove content"
              onSubmit={(
                verdict: KeyOf<typeof FLAG_REASON>,
                renderErrorMsg,
                renderSuccessMsg
              ) => {
                removeFlaggedContent({
                  apiParams: {
                    flagIds: [r.id],
                    // @ts-ignore
                    verdictChoice: verdict,
                  },
                  onError: renderErrorMsg,
                  onSuccess: () => {
                    renderSuccessMsg();
                    setResults(results.filter((res) => res.id !== r.id));
                    setNumNavInteractions(numNavInteractions - 1);
                  },
                });
              }}
            >
              <IconButton>
                <span style={{ color: colors.RED() }}>Remove content</span>
              </IconButton>
            </FlagButtonV2>
          ),
          label: "Remove Content",
          style: styles.flagAndRemove,
          isActive: appliedFilters.verdict === "OPEN",
        },
        {
          html: (
            <IconButton
              className={css(
                styles.bulkAction,
                styles.checkIcon,
                styles.bulkActionApprove
              )}
              onClick={() => {
                if (confirm("Dismiss flag?")) {
                  dismissFlaggedContent({
                    apiParams: {
                      flagIds: [r.id],
                      // @ts-ignore
                      verdictChoice: r.reasonChoice,
                    },
                    onSuccess: () => {
                      setMessage("Flag dismissed");
                      showMessage({ show: true, error: false });
                      setResults(results.filter((res) => res.id !== r.id));
                      setNumNavInteractions(numNavInteractions - 1);
                    },
                    onError: () => {
                      setMessage("Failed. Flag likely already dismissed.");
                      showMessage({ show: true, error: true });
                    },
                  });
                }
              }}
            >
              Dismiss Flag
            </IconButton>
          ),
          label: "Dismiss Flag",
          // style: styles.flagAndRemove,
          isActive: appliedFilters.verdict === "OPEN",
        },
      ];

      return (
        <div className={css(styles.result)} key={r.id}>
          {r.verdict && !isOneLineAction && (
            <>
              <div
                className={css(
                  styles.actionDetailsRow,
                  styles.verdictActionDetailsRow
                )}
              >
                <div className={css(styles.avatarContainer)}>
                  {/* @ts-ignore */}
                  <AuthorAvatar
                    size={25}
                    author={r.verdict.createdBy?.authorProfile}
                  />
                </div>
                <span className={css(styles.actionContainer)}>
                  {/* @ts-ignore */}
                  <ALink
                    href={`/user/${r.verdict.createdBy?.authorProfile.id}/overview`}
                  >
                    {r.verdict.createdBy?.authorProfile.firstName}{" "}
                    {r.verdict.createdBy?.authorProfile.lastName}
                  </ALink>
                  <span className={css(styles.flagText)}>
                    {appliedFilters.verdict === "APPROVED" ? (
                      <>
                        <span className={css(styles.icon)}>
                          &nbsp;
                          {<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                        </span>
                        &nbsp;dismissed flag
                      </>
                    ) : (
                      <>
                        <span className={css(styles.icon, styles.trashIcon)}>
                          &nbsp;
                          {<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
                        </span>
                        &nbsp;removed this content due to{" "}
                        <span className={css(styles.reason)}>
                          {FLAG_REASON[r.verdict.verdictChoice]}
                        </span>
                      </>
                    )}
                  </span>
                </span>
                <span className={css(styles.dot)}> • </span>
                <span className={css(styles.timestamp)}>
                  {timeSince(r.verdict.createdDate)}
                </span>
              </div>
              <div className={css(styles.timelineSeperator)}></div>
            </>
          )}
          <div className={css(styles.actionDetailsRow)}>
            <div className={css(styles.avatarContainer)}>
              {/* @ts-ignore */}
              <AuthorAvatar size={25} author={r?.flaggedBy?.authorProfile} />
            </div>
            <span className={css(styles.actionContainer)}>
              {/* @ts-ignore */}
              {r?.flaggedBy?.authorProfile ? (
                <ALink
                  href={`/user/${r?.flaggedBy?.authorProfile?.id}/overview`}
                >
                  {/* @ts-ignore */}
                  {r?.flaggedBy?.authorProfile?.firstName} {/* @ts-ignore */}
                  {r?.flaggedBy?.authorProfile?.lastName}
                </ALink>
              ) : (
                <span>User N/A</span>
              )}
              <span className={css(styles.flagText)}>
                {isOneLineAction ? (
                  appliedFilters.verdict === "APPROVED" ? (
                    <>
                      <span className={css(styles.icon)}>
                        &nbsp;
                        {<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
                      </span>
                      &nbsp;dismissed flag
                    </>
                  ) : (
                    <>
                      <span className={css(styles.icon, styles.trashIcon)}>
                        &nbsp;
                        {<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
                      </span>
                      {/* @ts-ignore */}
                      &nbsp;removed this content due to{" "}
                      <span className={css(styles.reason)}>
                        {/* @ts-ignore */}
                        {FLAG_REASON[r.verdict.verdictChoice]}
                      </span>
                    </>
                  )
                ) : (
                  <>
                    <span className={css(styles.icon)}>
                      &nbsp;{<FontAwesomeIcon icon={faFlag}></FontAwesomeIcon>}
                    </span>
                    &nbsp;flagged this content as{" "}
                    <span className={css(styles.reason)}>
                      {/* @ts-ignore */}
                      {FLAG_REASON[r.reason] ?? FLAG_REASON["NOT_SPECIFIED"]}
                    </span>
                  </>
                )}
              </span>
            </span>
            <span className={css(styles.dot)}> • </span>
            <span className={css(styles.timestamp)}>
              {timeSince(r.createdDate)}
            </span>
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
              <ContributionEntry
                entry={r}
                actions={cardActions}
                setHubsDropdownOpenForKey={setHubsDropdownOpenForKey}
                hubsDropdownOpenForKey={hubsDropdownOpenForKey}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  const selectedHub = suggestedHubs.find(
    (h) => String(appliedFilters.hubId) === String(h.id)
  ) || { label: "All Hubs", id: undefined, value: undefined };
  const selectedVerdict = verdictOpts.find(
    (v) => String(appliedFilters.verdict) === String(v.value)
  ) || { label: "Open", value: "OPEN" };
  return (
    <div className={css(styles.dashboardContainer)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>
          Flagged Content
          <span
            className={css(styles.redo)}
            onClick={() => loadResults(appliedFilters)}
          >
            {<FontAwesomeIcon icon={faRedo}></FontAwesomeIcon>}
          </span>
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
      <div
        className={css(
          styles.multiSelect,
          isMultiSelectSticky && styles.multiSelectSticky
        )}
        ref={multiSelectRef}
      >
        {selectedResultIds.length > 0 && (
          <div className={css(styles.activeDetailsRow)}>
            <span className={css(styles.numSelected)}>
              {selectedResultIds.length} selected.
            </span>
            <div className={css(styles.bulkActions)}>
              <span
                className={css(
                  styles.bulkAction,
                  styles.bulkActionRemove,
                  styles.flagIcon
                )}
                onClick={() => {
                  if (window.confirm("Remove all selected content?")) {
                    removeFlaggedContent({
                      apiParams: {
                        flagIds: selectedResultIds,
                      },
                      onSuccess: () => {
                        setNumNavInteractions(
                          numNavInteractions - selectedResultIds.length
                        );
                        setMessage("Flagged Content removed");
                        showMessage({ show: true, error: false });
                        setResults(
                          results.filter(
                            (res) => !selectedResultIds.includes(res.id)
                          )
                        );
                        setSelectedResultIds([]);
                      },
                      onError: () => {
                        setMessage("Failed to remove flagged content");
                        showMessage({ show: true, error: true });
                      },
                    });
                  }
                }}
              >
                <span style={{ color: colors.RED() }}>Remove Content</span>
              </span>
              <span
                className={css(
                  styles.bulkAction,
                  styles.checkIcon,
                  styles.bulkActionApprove
                )}
                onClick={() => {
                  if (confirm("Dismiss flags?")) {
                    dismissFlaggedContent({
                      apiParams: {
                        flagIds: selectedResultIds,
                      },
                      onSuccess: () => {
                        setNumNavInteractions(
                          numNavInteractions - selectedResultIds.length
                        );
                        setMessage("Flags dismissed");
                        showMessage({ show: true, error: false });
                        setResults(
                          results.filter(
                            (res) => !selectedResultIds.includes(res.id)
                          )
                        );
                        setSelectedResultIds([]);
                      },
                      onError: () => {
                        setMessage("Failed to dismiss flags");
                        showMessage({ show: true, error: true });
                      },
                    });
                  }
                }}
              >
                <span>Dismiss Flag</span>
              </span>
            </div>
          </div>
        )}
      </div>
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
              <div className={css(styles.noResults)}>No open flags.</div>
            )}
          </div>
          {nextResultsUrl && (
            <LoadMoreButton
              onClick={() => {
                setIsLoadingMore(true);
                loadResults(appliedFilters, nextResultsUrl);
              }}
              isLoading={isLoadingMore}
            />
          )}
        </>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(FlaggedContentDashboard);

const styles = StyleSheet.create({
  result: {
    display: "flex",
    marginBottom: 30,
    flexDirection: "column",
  },
  entry: {
    borderRadius: 4,
    background: "white",
    border: `1px solid ${colors.GREY(0.5)}`,
    width: "100%",
    display: "flex",
    userSelect: "none",
    padding: 15,
  },
  entryContainer: {
    display: "flex",
  },
  flagIcon: {
    fontSize: 13,
    border: "0",
    backgroundColor: "none",
    padding: 5,
    borderRadius: "50%",
    justifyContent: "center",
    color: colors.RED(0.6),
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
  checkbox: {
    alignSelf: "center",
    marginRight: 5,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
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
  dashboardContainer: {
    padding: "0 32px",
    maxWidth: 1200,
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputOverride: {
    minHeight: "unset",
  },
  dropdown: {
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
    display: "flex",
  },
  bulkAction: {
    marginTop: 2,
    display: "flex",
  },
  noResults: {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(0.5),
    lineHeight: "48px",
  },
  bulkActionRemove: {
    color: colors.RED(),
    cursor: "pointer",
  },
  bulkActionApprove: {},
  checkIcon: {
    cursor: "pointer",
    fontSize: 13,
    padding: 5,
    borderRadius: "50%",
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
    marginRight: 8,
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
  actionDetailsRow: {
    display: "flex",
    marginBottom: 15,
    alignItems: "center",
    fontSize: 16,
  },
  verdictActionDetailsRow: {
    marginBottom: 6,
  },
  icon: {
    fontSize: 14,
    color: colors.BLACK(0.75),
    marginLeft: 3,
    marginRight: 3,
  },
  actionContainer: {},
  flagText: {},
  reason: {
    fontWeight: 500,
  },
  dot: {
    color: colors.BLACK(0.5),
    whiteSpace: "pre",
  },
  timestamp: {
    color: colors.BLACK(0.5),
  },
  trashIcon: {
    fontSize: 16,
  },
  timelineSeperator: {
    background: colors.GREY(),
    height: 8,
    width: 4,
    borderRadius: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
});
