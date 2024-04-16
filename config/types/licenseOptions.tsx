import { faLock, faLockOpen } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import colors from "../themes/colors";

const styles = StyleSheet.create({
  labelContainer: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
  labelLockStatus: {
    background: colors.GREEN2(),
    borderRadius: "50px",
    padding: "4px 8px",
    color: colors.WHITE(),
    fontSize: 12,
    display: "flex",
    columnGap: "5px",
    fontWeight: 500,
  },
});

export const getLicenseOptions = () => {
  return LICENSE_OPTIONS.map((option) => {
    return {
      label: (
        <div className={css(styles.labelContainer)}>
          {option.label}
          {!option.isLocked && (
            <div className={css(styles.labelLockStatus)}>
              <FontAwesomeIcon icon={faLockOpen} /> PDF Available
            </div>
          )}
        </div>
      ),
      value: option.value,
      description: option.description,
    };
  });
};

// These options match the OpenAlex types.
// https://api.openalex.org/works?group_by=primary_location.license:include_unknown
export const LICENSE_OPTIONS = [
  {
    label: "Unknown",
    value: "unknown",
    isLocked: true,
    description: "The license status of this paper is unclear or not provided.",
  },
  {
    label: "CC BY",
    value: "cc-by",
    isLocked: false,
    description:
      "Allows others to distribute, remix, adapt, and build upon the work, even commercially, as long as they credit the author for the original creation.",
  },
  {
    label: "CC BY-NC-ND",
    value: "cc-by-nc-nd",
    isLocked: true,
    description:
      "Allows others to download the works and share them with others as long as they credit the author, but they can't change them in any way or use them commercially.",
  },
  {
    label: "CC BY-NC",
    value: "cc-by-nc",
    isLocked: true,
    description:
      "Allows others to remix, tweak, and build upon the work non-commercially, and although their new works must also acknowledge the author and be non-commercial, they don't have to license their derivative works on the same terms.",
  },
  {
    label: "CC BY-NC-SA",
    value: "cc-by-nc-sa",
    isLocked: true,
    description:
      "Allows others to remix, tweak, and build upon the work non-commercially, as long as they credit the author and license their new creations under the identical terms.",
  },
  {
    label: "CC BY-SA",
    value: "cc-by-sa",
    isLocked: false,
    description:
      "Allows others to remix, tweak, and build upon the work even for commercial purposes, as long as they credit the author and license their new creations under the identical terms.",
  },
  {
    label: "CC BY-ND",
    value: "cc-by-nd",
    isLocked: false,
    description:
      "Allows for redistribution, commercial and non-commercial, as long as the work is passed along unchanged and in whole, with credit to the author.",
  },
  {
    label: "Publisher-Specific Open-Access",
    value: "publisher-specific-oa",
    isLocked: true,
    description:
      "Open access license defined by the publisher, which may include specific restrictions and conditions.",
  },
  {
    label: "Publisher-Specific or Author Manuscript",
    value: "publisher-specific, author manuscript",
    isLocked: true,
    description:
      "Includes publisher-specific licenses or papers that are author manuscripts, possibly with different usage rights.",
  },
  {
    label: "CC0 (Public Domain)",
    value: "public-domain",
    isLocked: false,
    description:
      "Indicates that the author has waived all copyright and related rights, placing the work in the public domain.",
  },
  {
    label: "Other Open-Access",
    value: "other-oa",
    isLocked: true,
    description:
      "Open access license not covered by other categories, may include various less common open-access types.",
  },
];
