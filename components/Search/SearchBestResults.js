import { StyleSheet, css } from "aphrodite";
import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import ComponentWrapper from "~/components/ComponentWrapper";
import colors, { genericCardColors } from "~/config/themes/colors";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";
import SearchResultsForPeople from "~/components/Search/SearchResultsForPeople";
import SearchResultsForHubs from "~/components/Search/SearchResultsForHubs";
import { breakpoints } from "~/config/themes/screen";
import Link from "next/link";

const SearchBestResults = ({ apiResponse }) => {
  const router = useRouter();
  const maxResultsPerSection = 2;
  const entityToHumanReadable = {
    person: "people",
    hub: "hubs",
    paper: "papers",
    post: "posts",
  };

  const renderSeeMoreLink = ({ relPath, text }) => {
    return (
      <div className={css(styles.linkWrapper)}>
        <Link
          href={"/search/[type]"}
          as={`/search/${relPath}?q=${router.query.q}`}
          shallow={true}
          replace={true}
          scroll={false}
        >
          <div className={css(styles.link)}>{text}</div>
        </Link>
      </div>
    );
  };

  const renderResultSection = ({ key, results }) => {
    if (!(Array.isArray(results) && results.length > 0)) {
      return null;
    }

    return (
      <section className={css(styles.section)}>
        <h2 className={css(styles.sectionHeader)}>
          {entityToHumanReadable[key]}
        </h2>
        {key === "hub" ? (
          <SearchResultsForHubs
            apiResponse={{ results: results, count: results.length }}
            showResultsOnly={true}
          />
        ) : key === "paper" || key === "post" ? (
          <SearchResultsForDocs
            apiResponse={{ results: results, count: results.length }}
            showResultsOnly={true}
            entityType={key}
          />
        ) : key === "person" ? (
          <SearchResultsForPeople
            apiResponse={{ results: results, count: results.length }}
            showResultsOnly={true}
          />
        ) : null}
        {renderSeeMoreLink({
          relPath: key,
          text: `See all ${entityToHumanReadable[key]}`,
        })}
      </section>
    );
  };

  const hasNoResults = (apiResponse) => {
    const allResults = Object.values(apiResponse);
    for (let i = 0; i < allResults.length; i++) {
      const entityResultSet = allResults[i];

      if (!Array.isArray(entityResultSet)) {
        continue;
      } else if (entityResultSet.length > 0) {
        return false;
      }
    }

    return true;
  };

  return (
    <Fragment>
      <ComponentWrapper key="hub" overrideStyle={styles.componentWrapper}>
        {renderResultSection({ key: "hub", results: apiResponse["hub"] })}
      </ComponentWrapper>
      <ComponentWrapper key="paper" overrideStyle={styles.componentWrapper}>
        {renderResultSection({ key: "paper", results: apiResponse["paper"] })}
      </ComponentWrapper>
      <ComponentWrapper key="post" overrideStyle={styles.componentWrapper}>
        {renderResultSection({ key: "post", results: apiResponse["post"] })}
      </ComponentWrapper>
      <ComponentWrapper key="person" overrideStyle={styles.componentWrapper}>
        {renderResultSection({ key: "person", results: apiResponse["person"] })}
      </ComponentWrapper>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: 20,
  },
  section: {
    background: "white",
    padding: "24px 20px 24px 20px",
    borderRadius: "2px",
    border: `1px solid ${genericCardColors.BORDER}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "24px 20px 14px 20px",
    },
  },
  sectionHeader: {
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    paddingBottom: 10,
    marginBottom: 0,
    color: colors.BLACK(0.5),
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
    textTransform: "capitalize",
  },
  linkWrapper: {
    textAlign: "center",
    paddingTop: 24,
    borderTop: `1px solid ${genericCardColors.BORDER}`,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingTop: 14,
      fontSize: 14,
    },
  },
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
});

SearchBestResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchBestResults;
