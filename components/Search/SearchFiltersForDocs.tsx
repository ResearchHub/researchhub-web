import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RangeSlider from "../Form/RangeSlider";
import FormSelect, {
  LicenseOptionWithDescription,
} from "~/components/Form/FormSelect";
import SimpleSlider from "../Form/SimpleSlider";
import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { faFilter } from "@fortawesome/pro-regular-svg-icons";
import { useSearchFiltersContext } from "./lib/SearchFiltersContext";
import AppliedFilters from "./lib/AppliedFilters";
import { getLicenseOptions } from "~/config/types/licenseOptions";
import useWindow from "~/config/hooks/useWindow";
import { sortOpts } from "./lib/SearchSortOpts";

export type FilterType =
  | "citation_percentile"
  | "publication_year"
  | "journal"
  | "hub"
  | "license"
  | "ordering";

interface Props {
  onChange: (filterType: FilterType, filterValue) => void;
  searchFacets: any;
  showLabels?: boolean;
  fullWidth?: boolean;
  onlyFilters?: FilterType[];
  direction?: "horizontal" | "vertical";
  forEntityType: "paper" | "post";
}

const Filters = ({
  onChange,
  searchFacets,
  showLabels = true,
  onlyFilters,
  direction = "horizontal",
  fullWidth = false,
  forEntityType,
}: Props) => {
  const [facetValuesForHub, setFacetValuesForHub] = useState([]);
  const [facetValuesForJournal, setFacetValuesForJournal] = useState([]);
  const [facetValuesForLicense, setFacetValuesForLicense] = useState([]);
  const [facetValuesForPublicationYear, setFacetValuesForPublicationYear] =
    useState([]);

  const {
    selectedJournals,
    selectedHubs,
    selectedLicenses,
    selectedPublishYearRange,
  } = useSearchFiltersContext();

  useEffect(() => {
    setFacetValuesForHub(get(searchFacets, "_filter_hubs.hubs.buckets", []));
    setFacetValuesForJournal(
      get(searchFacets, "_filter_external_source.external_source.buckets", [])
    );
    setFacetValuesForLicense(
      get(searchFacets, "_filter_pdf_license.pdf_license.buckets", [])
    );
    setFacetValuesForPublicationYear(
      get(
        searchFacets,
        "_filter_paper_publish_year.paper_publish_year.buckets",
        []
      )
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
  const facetValueOptsForPublicationYear = facetValuesForPublicationYear.reduce(
    (acc, { key, doc_count }) => {
      acc[key] = doc_count;
      return acc;
    },
    {}
  );

  const availableFacetValuesForLicense = getFacetOptionsForDropdown("license");
  const facetValueOptsForLicense = getLicenseOptions()
    .map((l) => {
      const found = availableFacetValuesForLicense.find(
        (f) => f.value === l.value
      );
      if (found) {
        return { ...found, ...l };
      }
    })
    .filter((l) => l);

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
            isSearchable={false}
            placeholder={"Hubs"}
            value={selectedHubs}
            isMulti={true}
            multiTagStyle={null}
            multiTagLabelStyle={null}
            isClearable={false}
            reactSelect={{
              styles: {
                menu: {
                  width: direction === "vertical" ? "100%" : "max-content",
                },
              },
            }}
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
            isSearchable={false}
            placeholder={"Journal"}
            reactSelect={{
              styles: {
                menu: {
                  width: direction === "vertical" ? "100%" : "max-content",
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
            selectComponents={{
              Option: LicenseOptionWithDescription,
            }}
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
                  width: direction === "vertical" ? "100%" : "max-content",
                },
              },
            }}
            value={selectedLicenses}
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
          {showLabels && (
            <div className={css(styles.filterLabel)}>Percentile</div>
          )}
          <p className={css(styles.filterDescription)}>
            Show only the most-cited papers above a specified citation threshold
          </p>
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
          {showLabels && (
            <div className={css(styles.filterLabel)}>Publication Year</div>
          )}
          <p className={css(styles.filterDescription)}>
            Shows only papers published within specified range
          </p>
          <div style={{ padding: "0px 5px" }}>
            <RangeSlider
              // TODO: Make min and max dynamic
              min={2000}
              max={2024}
              // @ts-ignore
              defaultValues={
                selectedPublishYearRange[0] ? selectedPublishYearRange : null
              }
              // @ts-ignore
              onChange={(value: number) => onChange("publication_year", value)}
              histogram={facetValueOptsForPublicationYear}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SearchFilters = ({ onChange, searchFacets, forEntityType }: Props) => {
  const { width: winWidth } = useWindow();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { selectedSortOrder } = useSearchFiltersContext();

  const isMobile = useMediaQuery(`(max-width:${breakpoints.small.str})`);
  const showMoreFilters = forEntityType === "paper";

  return (
    <>
      <div className={css(styles.filtersAndSortWrapper)}>
        <div className={css(styles.filtersWrapper)}>
          {!isMobile && (
            <Filters
              onChange={onChange}
              showLabels={false}
              onlyFilters={
                forEntityType === "paper" ? ["journal", "hub"] : ["hub"]
              }
              searchFacets={searchFacets}
              forEntityType={forEntityType}
            />
          )}
          {showMoreFilters && (
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
          )}
        </div>

        <FormSelect
          id={"ordering"}
          placeholder={"Sort"}
          options={sortOpts}
          value={selectedSortOrder}
          containerStyle={[
            styles.dropdownContainer,
            styles.dropdownContainerForSort,
          ]}
          inputStyle={styles.dropdownInputForSort}
          onChange={onChange}
          isSearchable={false}
          showLabelAlongSelection={
            winWidth && winWidth <= breakpoints.small.int ? true : false
          }
        />
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
              forEntityType={forEntityType}
            />
          </Box>
        </SwipeableDrawer>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="Filters"
          aria-describedby="Search filters"
          BackdropProps={{
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
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
                forEntityType={forEntityType}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  filterLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  filterDescription: {
    fontSize: 14,
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    borderRadius: 4,
    backgroundColor: "white",
    boxShadow: "rgba(0, 0, 0, 0.28) 0px 8px 28px",
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
    rowGap: 10,
  },
  filterWrapper: {},
  filtersWrapper: {
    display: "flex",
  },
  filtersAndSortWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
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
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    marginBottom: 20,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
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
    },
  },
  dropdownContainerForSort: {
    width: 150,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
    },
  },
  dropdownInputForSort: {
    minHeight: "unset",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
    },
  },
  dropdownInput: {
    width: 160,
    minHeight: "unset",
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
