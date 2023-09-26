import { GetStaticProps, NextPage } from "next";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import { Hub, parseHub } from "~/config/types/hub";
import { StyleSheet, css } from "aphrodite";
import HubCard from "~/components/Hubs/HubCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/pro-light-svg-icons";
import Menu, { MenuOption } from "~/components/shared/GenericMenu";
import { use, useEffect, useRef, useState } from "react";
import { fetchHubSuggestions } from "~/components/SearchSuggestion/lib/api";
import debounce from "lodash/debounce";
import Error from "next/error";

type Props = {
  hubs: any[];
  errorCode?: number;
};

const HubsPage: NextPage<Props> = ({ hubs, errorCode }) => {
  const sortOpts = [
    { label: "Popular", value: "score" },
    { label: "Name", value: "name" },
  ];

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  const [parsedHubs, setParsedHubs] = useState<Hub[]>(
    hubs.map((hub) => parseHub(hub))
  );
  const [sort, setSort] = useState<MenuOption>(sortOpts[0]);
  const prevSortValue = useRef(sort);
  const [suggestions, setSuggestions] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchHubSuggestions(query)
      .then((suggestions) => {
        // @ts-ignore
        setSuggestions(suggestions);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  useEffect(() => {
    (async () => {
      const sortValueChanged = prevSortValue.current.value !== sort.value;
      if (sortValueChanged) {
        // @ts-ignore
        const { hubs } = await getHubs({ ordering: sort.value });
        const parsedHubs = hubs.map((hub) => parseHub(hub));
        setParsedHubs(parsedHubs);
        prevSortValue.current = sort;
      }
    })();
  }, [sort]);

  const debouncedSetQuery = debounce(setQuery, 500);

  const hubsToRender = suggestions.length > 0 ? suggestions : parsedHubs;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title) + " clamp2"}>Hubs</h1>
      </div>
      <div className={css(styles.description)}>
        Within ResearchHub, papers are organized into hubs. Hubs are collections
        of papers that are related to a specific topic. Use this page to explore
        hubs.
      </div>
      <div className={css(styles.searchAndFilters)}>
        <div className={css(styles.search)}>
          <FontAwesomeIcon
            style={{ color: "#7C7989" }}
            icon={faSearch}
          ></FontAwesomeIcon>
          <input
            className={css(styles.input)}
            type="text"
            // value={query}
            onChange={(e) => {
              debouncedSetQuery(e.target.value);
            }}
            placeholder="Search hubs"
          />
        </div>
        <Menu
          options={sortOpts}
          id="hub-sort"
          selected={sort.value}
          direction="bottom-right"
          onSelect={(option) => {
            setSort(option);
          }}
        >
          <div className={css(styles.sortTrigger)}>
            {sort.label}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{ marginLeft: 3, fontSize: 16 }}
            />
          </div>
        </Menu>
      </div>
      <div className={css(styles.cardsWrapper)}>
        {hubsToRender.map((h) => (
          <HubCard hub={h} key={h.id} />
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  searchAndFilters: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 15,
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    width: "100%",
  },
  description: {
    fontSize: 15,
    marginBottom: 15,
    maxWidth: 790,
    lineHeight: "22px",
  },
  sortTrigger: {
    display: "flex",
    columnGap: "4px",
    alignItems: "center",
    fontWeight: 500,
    padding: "8px 10px 8px 10px",
    fontSize: 14,
    border: `1px solid #E9EAEF`,
    borderRadius: 4,
  },
  search: {
    width: 400,
    boxSizing: "border-box",
    paddingLeft: "12px",
    paddingRight: "12px",
    border: `1px solid #E9EAEF`,
    display: "flex",
    borderRadius: 4,
    alignItems: "center",
  },
  input: {
    border: 0,
    width: "100%",
    marginLeft: 10,
    height: 30,
    outline: "none",
    fontSize: 14,
  },
  container: {
    width: 1340,
    margin: "0 auto",
    marginTop: 40,
  },
  cardsWrapper: {
    borderTop: `1px solid #E9EAEF`,
    paddingTop: 20,
    marginTop: 20,
    display: "flex",
    maxWidth: "100%",
    flexWrap: "wrap",
    columnGap: "20px",
    rowGap: "20px",
  },
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    // @ts-ignore
    const { hubs } = await getHubs({});

    return {
      props: {
        hubs,
      },
      revalidate: 600,
    };
  } catch (error) {
    return {
      props: {
        errorCode: 500,
      },
      revalidate: 5,
    };
  }
};

export default HubsPage;
