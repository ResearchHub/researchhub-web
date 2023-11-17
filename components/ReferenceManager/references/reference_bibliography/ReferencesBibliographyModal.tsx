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
      const selectedItems = referenceTableRowData
        .filter((rowData: ReferenceTableRowDataType): boolean =>
          selectedIDSet.has(rowData.id)
        )
        .map((selected) => {
          const fields = selected.fields ?? {};
          const result = {
            ...fields,
            year: fields?.date?.split("-")[2],
            author: fields.author.map((creator): { name: string } => {
              return { name: creator.given + " " + creator.family };
            }),
            identifier: [{ type: "doi", id: fields.DOI ?? fields.doi }],
            journal: { name: fields.journal_abbreviation },
          };
          delete result.date;
          delete result.access_date;
          return result;
        });

      setFormattedBibliography(
        selectedItems.map((item): string => {
          cite.set(item);
          return cite.format("bibliography", {
            format: "text",
            template: "apa",
          });
        })
      );
    }
  }, [selectedReferenceIDs]);

  const bibliographyList = formattedBibliography.map(
    (biblio: NullableString, elIndex: number) => (
      <Typography
        key={elIndex}
        variant="subtitle2"
        sx={{ marginBottom: "16px" }}
      >
        {biblio}
      </Typography>
    )
  );

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
      modalContent={
        <Box sx={{ marginBottom: "16px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "38px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6">
              {"Bibliography (APA)"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {bibliographyList}
          </Box>
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
  copyButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "28px",
    minWidth: "70px",
  },
});
