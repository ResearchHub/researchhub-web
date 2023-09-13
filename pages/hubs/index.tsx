import { GetStaticProps, NextPage } from "next";
import { getHubs } from "~/components/Hubs/api/fetchHubs";
import { parseHub } from "~/config/types/hub";
import { StyleSheet, css } from "aphrodite";
import HubCard from "~/components/Hubs/HubCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSearch } from "@fortawesome/pro-light-svg-icons";
import Menu, { MenuOption } from "~/components/shared/GenericMenu";
import { useState } from "react";

type Props = {
  hubs: any[];
};

const HubsPage: NextPage<Props> = ({ hubs }) => {
  const sortOpts = [
    { label: "Popular", value: "popular" },
    { label: "Name", value: "Name" },
  ];

  const [sort, setSort] = useState<MenuOption>(sortOpts[0]);
  const parsedHubs = hubs.map((hub) => parseHub(hub));

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.searchAndFilters)}>
        <div className={css(styles.search)}>
          <FontAwesomeIcon
            style={{ color: "#7C7989" }}
            icon={faSearch}
          ></FontAwesomeIcon>
          <input
            className={css(styles.input)}
            type="text"
            placeholder="Search hubs"
          />
        </div>
        <Menu options={sortOpts} id="hub-sort" selected={sort.value}>
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
        {parsedHubs.map((h, index) => (
          <HubCard hub={h} key={index} />
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
    maxWidth: 1340,
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
  // @ts-ignore
  const { hubs } = await getHubs();

  return {
    props: {
      errorCode: 500,
      hubs,
    },
    revalidate: 600,
  };
};

export default HubsPage;
