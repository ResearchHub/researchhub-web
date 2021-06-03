import React from "react";
import { css, StyleSheet } from "aphrodite";
import algoliasearch from "algoliasearch/lite";
import { getAlgoliaResults } from "@algolia/autocomplete-js";
import AlgoliaAutocomplete from "~/components/Search/AlgoliaAutocomplete";
import AlgoliaSearchEntry from "~/components/Search/AlgoliaSearchEntry";
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from "~/config/constants";
import "@algolia/autocomplete-theme-classic";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const AlgoliaSearch = () => {
  const indicesToSearch = [`papers_${process.env.NODE_ENV}`];

  return (
    <div className={css(styles.algoliaSearch)}>
      <AlgoliaAutocomplete
        getSources={({ query }) => [
          {
            sourceId: "products",
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: indicesToSearch.map((indexName) => ({
                  query,
                  indexName,
                })),
              });
            },
            templates: {
              item({ item, components }) {
                return (
                  <AlgoliaSearchEntry hit={item} components={components} />
                );
              },
            },
          },
        ]}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  algoliaSearch: {
    // TODO: Add Styles
  },
});

export default AlgoliaSearch;
