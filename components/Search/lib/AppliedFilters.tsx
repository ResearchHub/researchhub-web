import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import Badge from "~/components/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-solid-svg-icons";
import { useSearchFiltersContext } from "../lib/SearchFiltersContext";

const AppliedFilters = ({}) => {
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

  const getLabelForPaperPublicationYear = () => {
    const min = selectedPublishYearRange[0];
    const max = selectedPublishYearRange[1];

    if (min && max && min !== max) {
      return `${min} - ${max}`;
    } else if (min && max && min === max) {
      return `${min}`;
    }

    return "Publication Year";
  };

  const renderAppliedFilterBadge = ({ opt, dropdownKey }) => {
    return (
      <Badge
        id={`${dropdownKey}-${opt.value}`}
        key={`${dropdownKey}-${opt.value}`}
        label={`${dropdownKey}: ${opt.label}`}
        badgeClassName={styles.appliedFilterBadge}
        badgeLabelClassName={styles.appliedFilterBadgeLabel}
        onClick={() => removeFilter({ opt, dropdownKey })}
        onRemove={() => removeFilter({ opt, dropdownKey })}
      />
    );
  };

  return (
    <div className={css(styles.appliedFiltersWrapper)}>
      {hasAppliedFilters() && (
        <div className={css(styles.appliedFilters)}>
          {selectedHubs.map((opt) =>
            renderAppliedFilterBadge({ opt, dropdownKey: "hub" })
          )}
          {selectedJournals.map((opt) =>
            renderAppliedFilterBadge({ opt, dropdownKey: "journal" })
          )}
          {selectedPublishYearRange[0] && (
            <Badge
              id={`paper_publish_year-badge`}
              label={`Published: ${getLabelForPaperPublicationYear()}`}
              badgeClassName={styles.appliedFilterBadge}
              badgeLabelClassName={styles.appliedFilterBadgeLabel}
              onClick={() =>
                removeFilter({ dropdownKey: "paper_publish_year" })
              }
              onRemove={() =>
                removeFilter({ dropdownKey: "paper_publish_year" })
              }
            />
          )}
          {selectedCitationPercentile > 0 && (
            <Badge
              id={`citation_percentile-badge`}
              label={`Percentile: ${selectedCitationPercentile + "th"}`}
              badgeClassName={styles.appliedFilterBadge}
              badgeLabelClassName={styles.appliedFilterBadgeLabel}
              onClick={() =>
                removeFilter({ dropdownKey: "citation_percentile" })
              }
              onRemove={() =>
                removeFilter({ dropdownKey: "citation_percentile" })
              }
            />
          )}

          <Badge
            id="clear-all"
            badgeClassName={styles.clearFiltersBadge}
            onClick={clearFilters}
            badgeLabelClassName={undefined}
          >
            <span>CLEAR FILTERS</span>
            <FontAwesomeIcon style={{ fontSize: 10 }} icon={faX} />
          </Badge>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  appliedFiltersWrapper: {
    display: "flex",
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

export default AppliedFilters;
