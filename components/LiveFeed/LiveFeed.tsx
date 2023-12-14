import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faStar, faGrid2 } from "@fortawesome/pro-solid-svg-icons";
import fetchContributionsAPI, { ApiFilters } from "./api/fetchContributionsAPI";
import {
  Contribution,
  getContributionUrl,
  parseContribution,
} from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState, useEffect } from "react";
import colors from "~/config/themes/colors";
import LoadMoreButton from "../LoadMoreButton";
import ContributionEntry from "./Contribution/ContributionEntry";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import Link from "next/link";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import HorizontalTabBar, { Tab } from "~/components/HorizontalTabBar";
import { PaperIcon } from "~/config/themes/icons";
import { faGlobe, faX } from "@fortawesome/pro-regular-svg-icons";
import { useRouter } from "next/router";
import HubSelectModal from "../Hubs/HubSelectModal";
import fetchHubDetailsAPI from "../Hubs/api/fetcHubDetails";
import { Hub, parseHub } from "~/config/types/hub";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { truncateText } from "~/config/utils/string";
import { breakpoints } from "~/config/themes/screen";

const getAppliedUrlFiltersForLiveFeed = (router) => {
  const appliedFilters: ApiFilters = {
    // Defaults
    hubId: null,
    contentType: "ALL",
  };
  const availableContentTypes = tabs.map((t) => t.value);

  const hasContentTypeFilter =
    router.query?.contentType &&
    availableContentTypes.includes(router.query.contentType as string);
  appliedFilters.contentType = hasContentTypeFilter
    ? (router.query.contentType as string)
    : "ALL";
  appliedFilters.hubId = router.query?.hubId
    ? (router.query.hubId as string)
    : null;

  return appliedFilters;
};

const tabs: Array<Tab> = [
  {
    icon: <FontAwesomeIcon icon={faGlobe} />,
    label: "All",
    value: "ALL",
    isSelected: true,
  },
  {
    icon: <FontAwesomeIcon icon={faComments} />,
    label: "Conversation",
    value: "CONVERSATION",
  },
  {
    icon: (
      <ResearchCoinIcon
        version={4}
        color={colors.BLACK(0.5)}
        height={14}
        width={14}
      />
    ),
    selectedIcon: (
      <ResearchCoinIcon
        version={4}
        color={colors.NEW_BLUE(1.0)}
        height={14}
        width={14}
      />
    ),
    hoverIcon: (
      <ResearchCoinIcon
        version={4}
        color={colors.NEW_BLUE(1.0)}
        height={14}
        width={14}
      />
    ),
    label: "Bounties",
    value: "BOUNTY",
  },
  {
    icon: <FontAwesomeIcon icon={faStar} />,
    label: "Peer Reviews",
    value: "REVIEW",
  },
];

const getTabsForLiveFeed = (filters: ApiFilters) => {
  const _tabs = tabs.map((tab) => {
    return {
      ...tab,
      isSelected: tab.value === filters.contentType,
    };
  });

  return _tabs;
};

export default function LiveFeed(): ReactElement<"div"> {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [liveFeedForHub, setLiveFeedForHub] = useState<undefined | Hub>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const appliedUrlFilters = getAppliedUrlFiltersForLiveFeed(router);
  const tabs = getTabsForLiveFeed(appliedUrlFilters);

  useEffect(() => {
    loadResults({});
  }, [router.query]);

  useEffect(() => {
    if (appliedUrlFilters.hubId) {
      (async () => {
        const hub = await fetchHubDetailsAPI({
          hubId: appliedUrlFilters.hubId,
        });
        if (hub) {
          const parsedHub = parseHub(hub);
          setLiveFeedForHub(parsedHub);
        }
      })();
    }
  }, [appliedUrlFilters.hubId]);

  const loadResults = ({ nextResultsUrl }: { nextResultsUrl?: string }) => {
    if (!nextResultsUrl) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingMore(true);
    }

    fetchContributionsAPI({
      pageUrl: nextResultsUrl,
      filters: appliedUrlFilters,
      onSuccess: (response: any) => {
        const incomingResults = response.results.map((r) => {
          return parseContribution(r);
        });

        if (nextResultsUrl) {
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

  const entries = results
    .map((result, idx) => {
      try {
        const url = getContributionUrl(result);
        return {
          url,
          el: (
            <ContributionEntry
              key={`entry-${idx}`}
              entry={result}
              actions={[]}
              context="live-feed"
            />
          ),
        };
      } catch (error) {
        console.error("[Contribution] Could not render Entry", error);
        return null;
      }
    })
    .filter((r) => r !== null);

  const resultCards = entries.map((entry, idx) => {
    return (
      <Link
        href={entry!.url}
        className={css(styles.linkWrapper, styles.entryWrapper)}
      >
        <div key={`wrapped-entry-${idx}`} className={css(styles.result)}>
          <div className={css(styles.entry)}>{entry!.el}</div>
        </div>
      </Link>
    );
  });

  return (
    <div className={css(styles.pageWrapper) + " live-feed"}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title) + " clamp2"}>
          Live Feed
          {liveFeedForHub && (
            <>
              <FontAwesomeIcon
                fontSize={24}
                style={{ marginLeft: 10 }}
                icon={faAngleRight}
              />{" "}
              <div className={css(styles.hubName)}>{liveFeedForHub?.name}</div>
            </>
          )}
        </h1>
      </div>
      <div className={css(styles.titleContainerForSmallScreens)}>
        <h1 className={css(styles.title) + " clamp2"}>
          {liveFeedForHub ? `${liveFeedForHub?.name} Feed` : `Live Feed`}
        </h1>
      </div>
      <div className={css(styles.description)}>
        Stream of real-time activity{" "}
        {liveFeedForHub ? (
          <>
            in the{" "}
            <span className={css(styles.hubName)}>{liveFeedForHub.name}</span>{" "}
            hub
          </>
        ) : (
          "on ResearchHub"
        )}
        .
      </div>
      <HubSelectModal
        preventLinkClick={true}
        selectedHub={liveFeedForHub}
        isModalOpen={isModalOpen}
        handleModalClose={() => setIsModalOpen(false)}
        handleSelect={(hub) => {
          const query = {
            ...router.query,
            ...(hub?.id ? { hubId: hub.id } : {}),
          };
          if (!hub) {
            delete query.hubId;
            setLiveFeedForHub(undefined);
          }

          setIsModalOpen(false);
          router.push(
            {
              pathname: `/live`,
              query,
            },
            undefined,
            { shallow: true }
          );
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HorizontalTabBar
          tabs={tabs}
          variant="text"
          tabStyle={styles.tab}
          onClick={(selectedTab) => {
            const query = { ...router.query, contentType: selectedTab.value };
            if (query.contentType === "ALL") {
              delete query.contentType;
            }

            router.push(
              {
                pathname: `/live`,
                query,
              },
              undefined,
              { shallow: true }
            );
          }}
        />
        <div
          className={css(
            styles.tab,
            styles.hubsFilter,
            Boolean(router.query?.hubId) && styles.hubFilterSelected
          )}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>
          Hubs
          {router.query?.hubId && (
            <div
              style={{
                background: colors.NEW_BLUE(0.1),
                borderRadius: "5px",
                padding: "2px 10px",
                color: colors.NEW_BLUE(1.0),
                fontSize: 12,
              }}
            >
              1
            </div>
          )}
        </div>
      </div>
      {isLoadingPage ? (
        <div className={css(styles.placeholderWrapper)}>
          {Array(10)
            .fill(null)
            .map(() => (
              <LiveFeedCardPlaceholder color="#efefef" />
            ))}
        </div>
      ) : (
        <>
          <div className={css(styles.resultsContainer)}>
            {results.length > 0 ? (
              resultCards
            ) : (
              <div className={css(styles.noResults)}>No results.</div>
            )}
          </div>
          {nextResultsUrl && (
            <LoadMoreButton
              onClick={() => {
                setIsLoadingMore(true);
                loadResults({ nextResultsUrl });
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
  hubName: {
    textTransform: "capitalize",
    display: "inline-block",
  },
  description: {
    fontSize: 15,
    marginBottom: 15,
    maxWidth: 790,
    lineHeight: "22px",
  },
  title: {
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 0,
    textTransform: "capitalize",
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    width: "100%",
    marginBottom: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  titleContainerForSmallScreens: {
    marginBottom: 15,
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  tab: {
    fontSize: 14,
  },
  hubFilterSelected: {
    color: colors.NEW_BLUE(1),
  },
  hubsFilter: {
    fontWeight: 500,
    fontSize: 14,
    display: "flex",
    columnGap: "5px",
    alignItems: "center",
    borderBottom: "3px solid transparent",
    padding: "1rem 10px",
    ":hover": {
      color: colors.NEW_BLUE(1),
      cursor: "pointer",
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  pageWrapper: {
    maxWidth: 800,
    width: 800,
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: 25,
    [`@media only screen and (max-width: 800px)`]: {
      width: "auto",
    },
  },
  result: {
    display: "flex",
    marginBottom: 16,
    border: `1px solid ${colors.GREY_LINE(1.0)}`,
    borderRadius: "4px",
    padding: 16,
    background: "white",
    ":hover": {
      transition: "0.2s",
      background: colors.LIGHTER_GREY(1.0),
    },
  },
  entryWrapper: {
    cursor: "pointer",
  },
  placeholderWrapper: {
    width: "100%",
  },
  entry: {
    width: "100%",
    display: "flex",
  },
  linkWrapper: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
  },
  flagIcon: {
    width: 14,
    height: 14,
    maxHeight: 14,
    maxWidth: 14,
    minWidth: 14,
    minHeight: 14,
    fontSize: 13,
    background: "none",
    border: "none",
    marginLeft: "auto",
    color: colors.GREY(0.6),
    ":hover": {
      background: "none",
      color: colors.NEW_BLUE(1),
    },
  },
  noResults: {
    marginTop: 150,
    fontSize: 32,
    textAlign: "center",
    color: colors.BLACK(0.5),
  },
  resultsContainer: {
    // marginTop: 16,
  },
  numSelected: {
    marginRight: 10,
  },
  pageLoader: {
    marginTop: 150,
  },
});
