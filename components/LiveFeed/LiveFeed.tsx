import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faComments,
  faStar,
  faCircleCheck,
  faGrid2,
} from "@fortawesome/pro-solid-svg-icons";
import fetchContributionsAPI, { ApiFilters } from "./api/fetchContributionsAPI";
import {
  CommentContributionItem,
  Contribution,
  getContributionUrl,
  parseContribution,
} from "~/config/types/contribution";
import { css, StyleSheet } from "aphrodite";
import { ID, UnifiedDocument } from "~/config/types/root_types";
import { ReactElement, useState, useEffect } from "react";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";

import LoadMoreButton from "../LoadMoreButton";
import ContributionEntry from "./Contribution/ContributionEntry";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import Link from "next/link";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import HorizontalTabBar, { Tab } from "~/components/HorizontalTabBar";
import { PaperIcon } from "~/config/themes/icons";
import { faGlobe, faX } from "@fortawesome/pro-regular-svg-icons";

import BaseModal from "../Modals/BaseModal";
// import { css, StyleSheet } from "aphrodite";
// import VerificationForm from "./VerificationForm";
import { breakpoints } from "~/config/themes/screen";
import { Hub } from "~/config/types/hub";
import { useRouter } from "next/router";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import HubSelect from "../Hubs/HubSelect";

const HubSelectModal = ({
  isModalOpen = true,
  handleModalClose,
  handleSelect,
}) => {
  const [hubs, setHubs] = useState<Array<Hub>>([]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { hubs, count } = await getHubs({});
      setHubs(hubs);
    })();
  }, []);

  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      hideClose={false}
      title={"Filter by Hub"}
      closeModal={handleModalClose}
      zIndex={12}
      modalStyle={styles1.modalStyle}
      modalContentStyle={styles1.modalContentStyle}
    >
      <div className={css(styles1.formWrapper)}>
        <HubSelect
          count={1}
          hubs={hubs}
          handleClick={(hub) => {
            handleSelect(hub);
          }}
        />
      </div>
    </BaseModal>
  );
};

const styles1 = StyleSheet.create({
  formWrapper: {
    width: 540,
    height: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "90%",
    },
  },
  modalStyle: {
    width: "540px",
    maxHeight: 600,
  },
  modalTitleStyleOverride: {},
  modalContentStyle: {
    position: "relative",
    minHeight: 560,
    padding: "50px 25px ",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      height: "100%",
    },
  },
  prevActionWrapper: {
    position: "absolute",
    top: 12,
    left: 10,
  },
});

export const tabs: Array<Tab> = [
  {
    icon: <FontAwesomeIcon icon={faGlobe} />,
    label: "All",
    value: "all",
    isSelected: true,
  },
  {
    icon: <FontAwesomeIcon icon={faComments} />,
    label: "Conversation",
    value: "conversation",
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
    label: "Bounties",
    value: "bounties",
  },
  {
    icon: <FontAwesomeIcon icon={faStar} />,
    label: "Peer Reviews",
    value: "reviews",
  },
  {
    icon: <PaperIcon height={14} width={14} onClick={undefined} />,
    label: "Articles",
    value: "articles",
  },
];

export default function LiveFeed({ hub, isHomePage }): ReactElement<"div"> {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] = useState<ApiFilters>({
    hubId: hub?.id as ID,
    contentType: "all",
  });
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  const [results, setResults] = useState<Array<Contribution>>([]);
  const [nextResultsUrl, setNextResultsUrl] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const _appliedFilters: ApiFilters = {
      // Defaults
      hubId: null,
      contentType: "all",
    };
    const availableContentTypes = tabs.map((t) => t.value);

    const hasContentTypeFilter =
      router.query?.contentType &&
      availableContentTypes.includes(router.query.contentType as string);
    _appliedFilters.contentType = hasContentTypeFilter
      ? (router.query.contentType as string)
      : "all";
    _appliedFilters.hubId = router.query?.hubId
      ? (router.query.hubId as string)
      : null;

    setAppliedFilters(_appliedFilters);
    loadResults(_appliedFilters, null);
  }, [router.query]);

  // useEffect(() => {
  //   let appliedFilters = { hubId: null };
  //   if (hub?.id) {
  //     appliedFilters = { hubId: hub.id };
  //   }
  //   setAppliedFilters(appliedFilters);
  //   loadResults(appliedFilters, null);
  // }, [hub, isHomePage]);

  const loadResults = (filters: ApiFilters, url = null) => {
    if (!url) {
      setIsLoadingPage(true);
    } else {
      setIsLoadingMore(true);
    }

    fetchContributionsAPI({
      pageUrl: url,
      filters,
      onSuccess: (response: any) => {
        const incomingResults = response.results.map((r) => {
          return parseContribution(r);
        });

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
        <h1 className={css(styles.title) + " clamp2"}>Live Feed</h1>
      </div>
      <div className={css(styles.description)}>
        Stream of real-time activity on ResearchHub.
      </div>
      <HubSelectModal
        isModalOpen={isModalOpen}
        handleModalClose={() => setIsModalOpen(false)}
        handleSelect={(hubs) => {
          if (hubs?.length > 0) {
            const hub = hubs[0];
            setIsModalOpen(false);
            setAppliedFilters({ hubId: hub.id });
            router.push(`/live?hubId=${hub.id}`, undefined, { shallow: true });
          }
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HorizontalTabBar tabs={tabs} variant="text" tabStyle={styles.tab} />
        <div
          className={css(
            styles.tab,
            styles.hubsFilter,
            Boolean(appliedFilters.hubId) && styles.hubFilterSelected
          )}
          onClick={() => {
            if (appliedFilters.hubId) {
              setAppliedFilters({ hubId: null });
              router.push(`/live`, undefined, { shallow: true });
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          <FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>
          Hubs
          {appliedFilters.hubId && (
            <div
              style={{
                background: "rgb(233 233 233)",
                borderRadius: "5px",
                padding: "2px 10px",
                color: colors.BLACK(1.0),
                fontSize: 12,
              }}
            >
              <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
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
  description: {
    fontSize: 15,
    marginBottom: 15,
    maxWidth: 790,
    lineHeight: "22px",
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 0,
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    width: "100%",
    marginBottom: 15,
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
  },
  pageWrapper: {
    maxWidth: 800,
    width: 800,
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: 25,
    [`@media only screen and (max-width: 800px)`]: {
      width: "100%",
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
