import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import get from "lodash/get";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { fetchURL } from "~/config/fetch";
import Badge from "~/components/Badge";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import FeedCard from "~/components/Author/Tabs/FeedCard";
import LoadMoreButton from "~/components/LoadMoreButton";
import { fetchUserVote } from "~/components/UnifiedDocFeed/api/unifiedDocFetch";
import { breakpoints } from "~/config/themes/screen";
import { isString } from "~/config/utils/string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-solid-svg-icons";
import RangeSlider from "../Form/RangeSlider";
import FormSelect, {
  CustomSelectControlWithoutClickEvents,
} from "~/components/Form/FormSelect";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import SimpleSlider from "../Form/SimpleSlider";

import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { faFilter } from "@fortawesome/pro-regular-svg-icons";
import { useSearchFiltersContext } from "./lib/SearchFiltersContext";
import AppliedFilters from "./lib/AppliedFilters";

type FilterType =
  | "citation_percentile"
  | "publication_year"
  | "journal"
  | "hub"
  | "license";

interface Props {
  onChange: (filterType: FilterType, filterValue) => void;
  searchFacets: any;
  showLabels?: boolean;
  fullWidth?: boolean;
  onlyFilters?: FilterType[];
  direction?: "horizontal" | "vertical";
}

const Filters = ({
  onChange,
  searchFacets,
  showLabels = true,
  onlyFilters,
  direction = "horizontal",
  fullWidth = false,
}: Props) => {
  const [facetValuesForHub, setFacetValuesForHub] = useState([]);
  const [facetValuesForJournal, setFacetValuesForJournal] = useState([]);
  const [facetValuesForLicense, setFacetValuesForLicense] = useState([]);
  const {
    hasAppliedFilters,
    selectedJournals,
    selectedHubs,
    selectedLicenses,
    selectedPublishYearRange,
    selectedCitationPercentile,
    setSelectedJournals,
    setSelectedHubs,
    setSelectedLicenses,
    setSelectedPublishYearRange,
    setSelectedCitationPercentile,
    removeFilter,
    clearFilters,
  } = useSearchFiltersContext();

  useEffect(() => {
    setFacetValuesForHub(get(searchFacets, "_filter_hubs.hubs.buckets", []));
    setFacetValuesForJournal(
      get(searchFacets, "_filter_external_source.external_source.buckets", [])
    );
    setFacetValuesForLicense(
      get(searchFacets, "_filter_pdf_license.pdf_license.buckets", [])
    );
  }, [searchFacets]);

  const getFacetOptionsForDropdown = (facetKey) => {
    let facetValues = [];

    switch (facetKey) {
      case "hubs":
        facetValues = facetValuesForHub;
        break;
      case "journal":
        facetValues = facetValuesForJournal;
        break;
      case "license":
        facetValues = facetValuesForLicense;
        break;
    }

    return facetValues.map((f: any) => ({
      label: `${f.key} (${f.doc_count})`,
      value: f.key,
      valueForApi: f.key,
    }));
  };

  const facetValueOptsForHubs = getFacetOptionsForDropdown("hubs");
  const facetValueOptsForJournal = getFacetOptionsForDropdown("journal");
  const facetValueOptsForLicense = getFacetOptionsForDropdown("license");

  return (
    <div
      className={css(
        direction === "horizontal"
          ? styles.horizontalFilters
          : styles.verticalFilters
      )}
    >
      {(!onlyFilters || onlyFilters.includes("hub")) && (
        <div className={css(styles.filterWrapper)}>
          <FormSelect
            id={"hub"}
            options={facetValueOptsForHubs}
            containerStyle={[
              styles.dropdownContainer,
              fullWidth && styles.fullWidthInput,
            ]}
            inputStyle={[
              styles.dropdownInput,
              fullWidth && styles.fullWidthInput,
            ]}
            onChange={(id, value) => {
              onChange("hub", value);
            }}
            isSearchable={true}
            placeholder={"Hubs"}
            value={selectedHubs}
            isMulti={true}
            multiTagStyle={null}
            multiTagLabelStyle={null}
            isClearable={false}
            // reactSelect={{
            //   styles: {
            //     menu: {
            //       width:
            //         facetValueOptsForHubs.length > 0 ? "max-content" : "100%",
            //     },
            //   },
            // }}
            showCountInsteadOfLabels={true}
          />
        </div>
      )}
      {(!onlyFilters || onlyFilters.includes("journal")) && (
        <div className={css(styles.filterWrapper)}>
          <FormSelect
            id={"journal"}
            options={facetValueOptsForJournal}
            containerStyle={[
              styles.dropdownContainer,
              fullWidth && styles.fullWidthInput,
            ]}
            inputStyle={[
              styles.dropdownInput,
              fullWidth && styles.fullWidthInput,
            ]}
            onChange={(id, value) => {
              onChange("journal", value);
            }}
            isSearchable={true}
            placeholder={"Journal"}
            reactSelect={{
              styles: {
                menu: {
                  width:
                    facetValueOptsForJournal.length > 0
                      ? "max-content"
                      : "100%",
                },
              },
            }}
            value={selectedJournals}
            isMulti={true}
            multiTagStyle={null}
            multiTagLabelStyle={null}
            isClearable={false}
            showCountInsteadOfLabels={true}
          />
        </div>
      )}
      {(!onlyFilters || onlyFilters.includes("license")) && (
        <div className={css(styles.filterWrapper)}>
          <FormSelect
            id={"license"}
            options={facetValueOptsForLicense}
            containerStyle={[
              styles.dropdownContainer,
              fullWidth && styles.fullWidthInput,
            ]}
            inputStyle={[
              styles.dropdownInput,
              fullWidth && styles.fullWidthInput,
            ]}
            onChange={(id, value) => {
              onChange("license", value);
            }}
            isSearchable={true}
            placeholder={"License"}
            reactSelect={{
              styles: {
                menu: {
                  width:
                    facetValueOptsForJournal.length > 0
                      ? "max-content"
                      : "100%",
                },
              },
            }}
            value={selectedJournals}
            isMulti={true}
            multiTagStyle={null}
            multiTagLabelStyle={null}
            isClearable={false}
            showCountInsteadOfLabels={true}
          />
        </div>
      )}
      {(!onlyFilters || onlyFilters.includes("citation_percentile")) && (
        <div className={css(styles.filterWrapper)}>
          {showLabels && <div>Percentile</div>}
          <p>Shows only papers above specified citation percentile</p>
          <div style={{ padding: "0px 15px" }}>
            <SimpleSlider
              start={0}
              end={100}
              initial={50}
              onChange={(value: number) =>
                onChange("citation_percentile", value)
              }
            />
          </div>
        </div>
      )}
      {(!onlyFilters || onlyFilters.includes("publication_year")) && (
        <div className={css(styles.filterWrapper)}>
          {showLabels && <div>Publication Year</div>}
          <div style={{ padding: "0px 5px" }}>
            <RangeSlider
              // TODO: Make min and max dynamic
              min={2000}
              max={2024}
              // defaultValues={
              //   selectedPublishYearRange[0]
              //     ? selectedPublishYearRange
              //     : null
              // }
              // @ts-ignore
              onChange={(value: number) => onChange("publication_year", value)}
              // histogram={facetValueOptsForPublicationYear}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SearchFilters = ({
  onChange,
  searchFacets,
  showLabels = true,
  onlyFilters,
}: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    hasAppliedFilters,
    selectedJournals,
    selectedHubs,
    selectedLicenses,
    selectedPublishYearRange,
    selectedCitationPercentile,
    setSelectedJournals,
    setSelectedHubs,
    setSelectedLicenses,
    setSelectedPublishYearRange,
    setSelectedCitationPercentile,
    removeFilter,
    clearFilters,
  } = useSearchFiltersContext();

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div>
      <div style={{ display: "flex" }}>
        {!isMobile && (
          <Filters
            onChange={onChange}
            showLabels={false}
            onlyFilters={["journal", "hub"]}
            searchFacets={searchFacets}
          />
        )}
        <Button
          variant="contained"
          disableElevation={true}
          style={{
            background: "#FBFBFD",
            color: "#232038",
            border: "1px solid #E8E8F2",
            fontWeight: 400,
            textTransform: "none",
            fontSize: 14,
            borderRadius: 2,
            columnGap: "4px",
          }}
          onClick={handleOpen}
        >
          <FontAwesomeIcon icon={faFilter} />
          Filters
        </Button>
      </div>
      {isMobile ? (
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
        >
          <div className={css(styles.filtersHeading)}>
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </div>

          <Box
            sx={{ padding: "25px 35px 25px 25px" }}
            role="presentation"
            onClick={handleClose}
            onKeyDown={handleClose}
          >
            <AppliedFilters />
            <Filters
              onChange={onChange}
              searchFacets={searchFacets}
              direction="vertical"
              fullWidth
            />
          </Box>
        </SwipeableDrawer>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="Filters"
          aria-describedby="Search filters"
        >
          <div className={css(styles.modal)}>
            <div className={css(styles.filtersHeading)}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </div>

            <div className={css(styles.modalBody)}>
              <AppliedFilters />
              <Filters
                onChange={onChange}
                searchFacets={searchFacets}
                direction="vertical"
                fullWidth
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    border: "2px solid #000",
    backgroundColor: "white",
    // boxShadow: 24,
  },
  modalBody: {
    padding: "25px",
  },
  filtersHeading: {
    fontSize: 18,
    borderBottom: `1px solid #cecece`,
    padding: "15px",
    display: "flex",
    columnGap: "5px",
    fontWeight: 500,
  },
  horizontalFilters: {
    display: "flex",
    flexDirection: "row",
  },
  verticalFilters: {
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
  },
  filterWrapper: {},
  filtersWrapper: {
    display: "flex",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
  publicationYearDropdownWrapper: {
    position: "relative",
    zIndex: 9,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  // publicationYearDropdown: {
  //   position: "absolute",
  //   paddingRight: 30,
  //   paddingTop: 30,
  //   background: "white",
  //   zIndex: 1,
  //   width: 150,
  //   top: 40,
  //   left: 0,
  //   boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 10px 0px",
  // },
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    // boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      // flexWrap: "wrap",
      marginBottom: 0,
    },
  },
  fullWidthInput: {
    width: "100%",
  },
  dropdownContainer: {
    width: 150,
    minHeight: "unset",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginRight: 0,
      marginBottom: 10,
      // width: "100%",
    },
  },
  dropdownContainerForSort: {
    // marginRight: 0,
    // marginLeft: "auto",
    width: 150,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
      // width: "100%",
    },
  },
  dropdownInput: {
    width: 150,
    minHeight: "unset",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 200,
    },
  },
  appliedFilters: {
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    padding: "2px 2px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  highlight: {
    color: colors.ORANGE_DARK(1.0),
  },
  appliedFilterBadge: {
    borderRadius: 4,
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    padding: "2px 8px",
    letterSpacing: 0,
    ":hover": {
      color: colors.NEW_BLUE(),
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    },
  },
  appliedFilterBadgeLabel: {
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  clearFiltersBadge: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
    backgroundColor: "none",
    fontWeight: 500,
    color: colors.RED(),
    padding: "7px 8px",
    fontSize: 11,
    letterSpacing: "1px",
    ":hover": {
      background: colors.RED(0.1),
      color: colors.RED(),
      boxShadow: `inset 0px 0px 0px 1px ${colors.RED()}`,
    },
  },
});

export default SearchFilters;
