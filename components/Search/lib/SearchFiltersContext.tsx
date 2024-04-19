import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { NullableString } from "~/config/types/root_types";
import { isString } from "~/config/utils/string";
import get from "lodash/get";
import { sortOpts } from "./SearchSortOpts";

const getSelectedFacetValues = ({ router, forKey }) => {
  let selected: any = [];

  if (Array.isArray(router.query[forKey])) {
    selected = router.query[forKey];
  } else if (isString(router.query[forKey])) {
    selected = [router.query[forKey]];
  }

  return selected.map((v) => ({ label: v, value: v, valueForApi: v }));
};

const getSelectedDropdownValue = ({ router, forKey }) => {
  const urlParam = get(router, `query.${forKey}`, null);
  let dropdownValue: any = null;

  if (forKey === "ordering") {
    dropdownValue = sortOpts.find((opt) => opt.value === urlParam);
    dropdownValue =
      dropdownValue || sortOpts.find((opt) => opt.isDefault === true);
  }

  return dropdownValue;
};

export type SearchFiltersContextType = {
  hasAppliedFilters: () => boolean;
  selectedJournals: any[];
  selectedHubs: any[];
  selectedLicenses: any[];
  selectedPublishYearRange: [number, number];
  selectedCitationPercentile: number;
  selectedSortOrder: NullableString;
  setSelectedJournals: (journals: any[]) => void;
  setSelectedHubs: (hubs: any[]) => void;
  setSelectedLicenses: (licenses: any[]) => void;
  setSelectedPublishYearRange: (range: [number, number]) => void;
  setSelectedCitationPercentile: (percentile: number) => void;
  setSelectedSortOrder: (sortOrder: NullableString) => void;
  removeFilter: ({
    opt,
    dropdownKey,
  }: {
    opt?: any;
    dropdownKey: string;
  }) => void;
  clearFilters: () => void;
};

const SearchFiltersContext = createContext<SearchFiltersContextType>({
  hasAppliedFilters: () => false,
  selectedJournals: [],
  selectedHubs: [],
  selectedLicenses: [],
  selectedPublishYearRange: [0, 0],
  selectedCitationPercentile: 0,
  selectedSortOrder: null,
  setSelectedJournals: () => {
    throw new Error("setSelectedJournals() not implemented");
  },
  setSelectedHubs: () => {
    throw new Error("setSelectedHubs() not implemented");
  },
  setSelectedLicenses: () => {
    throw new Error("setSelectedLicenses() not implemented");
  },
  setSelectedPublishYearRange: () => {
    throw new Error("setSelectedPublishYearRange() not implemented");
  },
  setSelectedCitationPercentile: () => {
    throw new Error("setSelectedCitationPercentile() not implemented");
  },
  removeFilter: ({ opt, dropdownKey }) => {
    throw new Error("removeFilter() not implemented");
  },
  clearFilters: () => {
    throw new Error("clearFilters() not implemented");
  },
  setSelectedSortOrder: () => {
    throw new Error("setSelectedSortOrder() not implemented");
  },
});

export const useSearchFiltersContext = () => useContext(SearchFiltersContext);

export const SearchFiltersContextProvider = ({ children }) => {
  const router = useRouter();
  const [selectedHubs, setSelectedHubs] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedJournals, setSelectedJournals] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedLicenses, setSelectedLicenses] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedPublishYearRange, setSelectedPublishYearRange] = useState<
    [number, number]
  >([0, 0]);
  const [selectedCitationPercentile, setSelectedCitationPercentile] =
    useState(0);
  const [selectedSortOrder, setSelectedSortOrder] =
    useState<NullableString>(null);

  useEffect(() => {
    setSelectedHubs(getSelectedFacetValues({ router, forKey: "hub" }));
    setSelectedJournals(getSelectedFacetValues({ router, forKey: "journal" }));
    setSelectedLicenses(getSelectedFacetValues({ router, forKey: "license" }));
    setSelectedSortOrder(
      getSelectedDropdownValue({ router, forKey: "ordering" })
    );

    let publishYearMin = 0,
      publishYearMax = 0;
    let citationPercentile = 0;
    if (router.query.paper_publish_year__gte) {
      publishYearMin = parseInt(router.query.paper_publish_year__gte as string);
    }

    if (router.query.paper_publish_year__lte) {
      publishYearMax = parseInt(router.query.paper_publish_year__lte as string);
    }

    if (router.query.citation_percentile__gte) {
      citationPercentile = parseInt(
        router.query.citation_percentile__gte as string
      );
    }

    if (publishYearMin && publishYearMax) {
      setSelectedPublishYearRange([publishYearMin, publishYearMax]);
    } else {
      setSelectedPublishYearRange([0, 0]);
    }

    if (citationPercentile) {
      setSelectedCitationPercentile(citationPercentile);
    } else {
      setSelectedCitationPercentile(0);
    }
  }, [router.query]);

  const handleRemoveSelected = ({
    opt,
    dropdownKey,
  }: {
    opt?: any;
    dropdownKey: string;
  }) => {
    const updatedQuery = { ...router.query };

    if (dropdownKey === "hub") {
      const newValue = selectedHubs
        .filter((h) => h.value !== opt.value)
        .map((h) => h.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "journal") {
      const newValue = selectedJournals
        .filter((j) => j.value !== opt.value)
        .map((j) => j.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "license") {
      const newValue = selectedJournals
        .filter((j) => j.value !== opt.value)
        .map((j) => j.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "paper_publish_year") {
      delete updatedQuery["paper_publish_year__gte"];
      delete updatedQuery["paper_publish_year__lte"];
    } else if (dropdownKey === "citation_percentile") {
      delete updatedQuery["citation_percentile__gte"];
    }

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  return (
    <SearchFiltersContext.Provider
      value={{
        hasAppliedFilters: () =>
          selectedHubs.length > 0 ||
          selectedJournals.length > 0 ||
          selectedLicenses.length > 0 ||
          selectedPublishYearRange[0] > 0 ||
          selectedPublishYearRange[1] > 0 ||
          selectedCitationPercentile > 0,
        selectedJournals,
        selectedHubs,
        selectedPublishYearRange,
        selectedCitationPercentile,
        selectedLicenses,
        selectedSortOrder,
        setSelectedSortOrder,
        removeFilter: handleRemoveSelected,
        setSelectedJournals,
        setSelectedHubs,
        setSelectedPublishYearRange,
        setSelectedCitationPercentile,
        setSelectedLicenses,
        clearFilters: () => {
          const updatedQuery = {
            ...router.query,
          };

          delete updatedQuery["paper_publish_year__gte"];
          delete updatedQuery["paper_publish_year__lte"];
          delete updatedQuery["citation_percentile__gte"];
          delete updatedQuery["hub"];
          delete updatedQuery["journal"];
          delete updatedQuery["ordering"];
          delete updatedQuery["license"];

          router.push({
            pathname: "/search/[type]",
            query: updatedQuery,
          });
        },
      }}
    >
      {children}
    </SearchFiltersContext.Provider>
  );
};
