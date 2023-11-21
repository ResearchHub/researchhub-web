import { Box, Typography } from "@mui/material";
import { ID, NullableString } from "~/config/types/root_types";
import { isEmpty, silentEmptyFnc } from "~/config/utils/nullchecks";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useReferencesTableContext } from "../reference_table/context/ReferencesTableContext";
import CheckIcon from "@mui/icons-material/Check";
import Cite from "citation-js";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QuickModal from "../../menu/QuickModal";
import { ReferenceTableRowDataType } from "../reference_table/utils/formatReferenceRowData";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { formatBibliography } from "./export";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedReferenceIDs: ID[];
};

export default function ReferencesBibliographyModal({
  isOpen,
  onClose,
  selectedReferenceIDs,
}: Props): ReactElement {
  const { referenceTableRowData } = useReferencesTableContext();
  const [formattedBibliography, setFormattedBibliography] = useState<
    NullableString[]
  >([]);
  const [copyButtonStatus, setCopyButtonStatus] = useState<"copied" | null>(
    null
  );
  const cite = useMemo(() => new Cite(), []);

  useEffect((): void => {
    cite.reset();
    if (isEmpty(selectedReferenceIDs)) {
      setFormattedBibliography([]);
    } else {
      const selectedIDSet = new Set(selectedReferenceIDs);
      const selectedItems = referenceTableRowData.filter(
        (rowData: ReferenceTableRowDataType): boolean =>
          selectedIDSet.has(rowData.id)
      );

      const formatted = formatBibliography(selectedItems, "APA");

      setFormattedBibliography(formatted);
    }
  }, [selectedReferenceIDs]);

  const bibliographyContent = useMemo(() => {
    return formattedBibliography.map(
      (biblio: NullableString, elIndex: number) => (
        <div key={elIndex} className={css([styles.biblioItem])}>
          {biblio?.trim()}
        </div>
      )
    );
  }, [formattedBibliography]);

  const onCopyClick = (): void => {
    navigator.clipboard
      .writeText("• " + formattedBibliography.join(" • "))
      .then(() => {
        setCopyButtonStatus("copied");
        setTimeout((): void => {
          setCopyButtonStatus(null);
        }, 1000);
      })
      .catch(() => {
        setCopyButtonStatus(null);
      });
  };

  return (
    <QuickModal
      isOpen={isOpen}
      modalWidth="500px"
      modalContent={
        <Box sx={{ marginBottom: "16px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              {"Bibliography (APA)"}
            </Typography>
          </Box>
          <div className={css(styles.bibliographyContainer)}>
            {bibliographyContent}
          </div>
        </Box>
      }
      onClose={onClose}
      secondaryButtonConfig={{ label: "Close" }}
      primaryButtonConfig={{
        label:
          copyButtonStatus === null ? (
            <div className={css(styles.copyButton)}>
              <ContentCopyIcon sx={{ marginRight: "8px" }} fontSize="small" />
              {"Copy"}
            </div>
          ) : (
            <div className={css(styles.copyButton)}>
              <CheckIcon fontSize="small" />
            </div>
          ),
      }}
      onPrimaryButtonClick={onCopyClick}
      onSecondaryButtonClick={onClose}
    />
  );
}

const styles = StyleSheet.create({
  bibliographyContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: 296,
    overflowY: "scroll",
    padding: 16,
    border: `1px solid ${colors.GREY_BORDER}`,
    borderRadius: 4,
    marginBottom: 16,
  },
  biblioItem: {
    margin: 0,
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Roboto",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  copyButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "28px",
    minWidth: "70px",
  },
});
