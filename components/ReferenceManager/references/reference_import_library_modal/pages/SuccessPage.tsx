import { StyleSheet, css } from "aphrodite";
import React, { ReactElement, useMemo } from "react";
import colors from "~/config/themes/colors";
import { UploadLibraryEntryError } from "../../api/postUploadLibrary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/Form/Button";
import { ReferenceTableRowDataType } from "../../reference_table/utils/formatReferenceRowData";
import {
  faCircleCheck,
  faCircleExclamation,
  faFileExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import sharedStyles from "./sharedStyles";
import CollapsibleCard from "~/components/Form/CollapsibleCard";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const CardHeaderContent = ({
  icon,
  iconColor,
  title,
  subtitle,
}: {
  icon: IconProp;
  iconColor: string;
  title: string;
  subtitle?: string;
}) => (
  <div className={css(styles.collapsibleCardHeader)}>
    <FontAwesomeIcon
      style={{ fontSize: 18 }}
      icon={icon}
      color={iconColor}
    ></FontAwesomeIcon>
    <div className={css(styles.collapsibleCardTitles)}>
      <div className={css(styles.collapsibleCardTitle)}>{title}</div>
      {subtitle && <div className={css(styles.collapsibleCardDesc)}>{subtitle}</div>}
    </div>
  </div>
);

const CardContent = ({
  references,
  icon,
  iconColor,
  showErrorMsg = false,
  errorMap = {},
}: {
  references: ReferenceTableRowDataType[];
  icon: IconProp;
  iconColor: string;
  showErrorMsg?: boolean;
  errorMap?: Record<string | number, string>;
}) => (
  <div className={css(styles.referenceList)}>
    {references.map((ref) => (
      <div className={css(styles.referenceItem)} key={ref.id}>
        <FontAwesomeIcon
          style={{ fontSize: 16, transform: "translateY(3px)" }}
          icon={icon}
          color={iconColor}
        ></FontAwesomeIcon>
        <div className={css(styles.referenceItemContent)}>
          <div className={css(styles.referenceItemTitle)}>{ref.title}</div>
          <div className={css(styles.referenceItemSubtitle)}>
            {ref.authors?.split(",")[0]}
            {ref.authors?.split(",") &&
              ref.authors?.split(",").length > 1 &&
              ` et al.`}
          </div>
          {showErrorMsg && (
            <div className={css(styles.referenceItemError)}>
              {errorMap[ref.id!]}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const SuccessPage = ({
  references,
  errors = [],
  onClose,
}: {
  references: ReferenceTableRowDataType[];
  errors: UploadLibraryEntryError[];
  onClose: () => void;
}): ReactElement => {
  const [succeededRefs, missingPDFs, otherErrors, idToErrorMsg] =
    useMemo(() => {
      /**
       * Split references into 3 categories:
       * 1. Succeeded
       * 2. Missing PDFs
       * 3. Other errors
       * Based on errors returned from the backend.
       */
      const succeededRefs: ReferenceTableRowDataType[] = [];
      const missingPDFs: ReferenceTableRowDataType[] = [];
      const otherErrors: ReferenceTableRowDataType[] = [];
      const idToErrorMsg: Record<string | number, string> = {};

      errors.forEach((error) => {
        if (error.citationId) {
          const ref = references.find((ref) => ref.id === error.citationId);
          if (!ref) {
            // this shouldn"t happen
            return;
          }

          idToErrorMsg[ref.id!] = error.error;
          if (error.error.includes("PDF") || !ref.attachment) {
            missingPDFs.push(ref);
          } else {
            otherErrors.push(ref);
          }
        }
      });

      references.forEach((ref) => {
        if (!idToErrorMsg[ref.id!]) {
          succeededRefs.push(ref);
        }
      });

      return [succeededRefs, missingPDFs, otherErrors, idToErrorMsg];
    }, [errors, references]);

  const totalUploaded = succeededRefs.length + missingPDFs.length;

  return (
    <div className={css(sharedStyles.container)}>
      <div className={css(sharedStyles.header)}>
        <div className={css(sharedStyles.title)}>Import Complete</div>
        <div className={css(sharedStyles.subtitle)}>
          {totalUploaded} reference{totalUploaded !== 1 && "s"}{" "}
          {totalUploaded !== 1 ? "were" : "was"} uploaded.
        </div>
      </div>
      <div className={css(styles.cards)}>
        {otherErrors.length > 0 && (
          <CollapsibleCard
            title={
              <CardHeaderContent
                icon={faCircleExclamation}
                iconColor={colors.RED_DARK()}
                title={`Failed (${otherErrors.length})`}
                subtitle="Failed to import. Please try them again."
              />
            }
          >
            <CardContent
              references={otherErrors}
              icon={faCircleExclamation}
              iconColor={colors.RED_DARK()}
              showErrorMsg
              errorMap={idToErrorMsg}
            />
          </CollapsibleCard>
        )}
        {missingPDFs.length > 0 && (
          <CollapsibleCard
            title={
              <CardHeaderContent
                icon={faFileExclamation}
                iconColor={colors.ORANGE()}
                title={`Missing PDFs (${missingPDFs.length})`}
                subtitle="Successfully imported, but missing PDFs. You can add the PDFs manually in the reference manager."
              />
            }
          >
            <CardContent
              references={missingPDFs}
              icon={faFileExclamation}
              iconColor={colors.ORANGE()}
            />
          </CollapsibleCard>
        )}
        {succeededRefs.length > 0 && (
          <CollapsibleCard
            title={
              <CardHeaderContent
                icon={faCircleCheck}
                iconColor={colors.NEW_GREEN()}
                title={`Succeeded (${succeededRefs.length})`}
                subtitle="Successfully imported."
              />
            }
          >
            <CardContent
              references={succeededRefs}
              icon={faCircleCheck}
              iconColor={colors.NEW_GREEN()}
            />
          </CollapsibleCard>
        )}
      </div>
      <div className={css(sharedStyles.footer)}>
        <Button
          label="Finish & Close"
          variant="contained"
          onClick={onClose}
          customButtonStyle={sharedStyles.footerButton}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  collapsibleCardHeader: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
  },
  collapsibleCardTitles: {
    fontFamily: "Roboto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlign: "left",
    gap: 4,
  },
  collapsibleCardTitle: {
    fontSize: 16,
    fontWeight: 500,
    colors: colors.BLACK(),
  },
  collapsibleCardDesc: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    lineHeight: 1.4,
  },

  cards: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  // reference list
  referenceList: {
    gap: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 16,
    maxHeight: 200,
    overflowY: "scroll",
  },
  referenceItem: {
    width: "100%",
    fontSize: 14,
    color: colors.MEDIUM_GREY(),
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 12,
  },

  referenceItemIcon: {
    transform: "translateY(3px)",
  },
  referenceItemContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 4,
  },
  referenceItemTitle: {
    fontSize: 16,
    color: colors.BLACK(),
    lineHeight: 1.4,
  },
  referenceItemSubtitle: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
    lineHeight: 1.4,
  },
  referenceItemError: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.RED_DARK(),
  },
  referenceCount: {
    fontSize: 14,
    color: colors.MEDIUM_GREY(),
    marginTop: 8,
    marginBottom: 16,
  },
});

export default SuccessPage;
