import { StyleSheet, css } from "aphrodite";
import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import ComponentWrapper from "~/components/ComponentWrapper";
import colors, { genericCardColors } from "~/config/themes/colors";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";
import { breakpoints } from "~/config/themes/screen";

const SearchBestResults = ({ apiResponse }) => {
  const maxResultsPerSection = 2;

  const renderResultSection = ({ key, results }) => {
    return (
      <section className={css(styles.section)}>
        <h2 className={css(styles.sectionHeader)}>{`${key}s`}</h2>
        {key === "paper" || key === "post" ? (
          <SearchResultsForDocs
            apiResponse={{ results: results, count: results.length }}
            showResultsOnly={true}
            entityType={key}
          />
        ) : key === "person" ? null : null}
      </section>
    );
  };

  const hasNoResults = (apiResponse) => {
    const allResults = Object.values(apiResponse);
    for (let i = 0; i < allResults.length; i++) {
      const entityResultSet = allResults[i];

      if (entityResultSet.length > 0) {
        return false;
      }
    }

    return true;
  };

  return Object.keys(apiResponse).map((k) => (
    <ComponentWrapper key={k} overrideStyle={styles.componentWrapper}>
      {renderResultSection({ key: k, results: apiResponse[k] })}
    </ComponentWrapper>
  ));
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
    color: colors.BLACK(0.5),
    fontWeight: 500,
    fontSize: 16,
    marginTop: 0,
    textTransform: "capitalize",
  },
});

SearchBestResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchBestResults;
