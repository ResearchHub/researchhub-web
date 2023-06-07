import { Box, Typography } from "@mui/material";
import { ID, NullableString } from "~/config/types/root_types";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { isEmpty, silentEmptyFnc } from "~/config/utils/nullchecks";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QuickModal from "../../menu/QuickModal";
import Cite from "citation-js";
import CheckIcon from "@mui/icons-material/Check";

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
  const [formattedBibliography, setFormattedBibliography] = useState<
    NullableString[]
  >([]);
  const [copyButtonStatus, setCopyButtonStatus] = useState<"copied" | null>(
    null
  );
  const cite = useMemo(() => new Cite(), []);

  useEffect((): void => {
    if (isEmpty(selectedReferenceIDs)) {
      setFormattedBibliography([]);
      cite.reset();
    } else {
    }
  }, [selectedReferenceIDs]);

  const bibliographyList = formattedBibliography.map(
    (biblio: NullableString, elIndex: number) => (
      <Typography key={elIndex} variant="subtitle2">
        {biblio}
      </Typography>
    )
  );

  const onCopyClick = (): void => {
    navigator.clipboard
      .writeText(formattedBibliography.join(" • "))
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
        <Box sx={{ marginBottom: "16px", height: "120px" }}>
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
              background: "red",
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <ContentCopyIcon sx={{ marginRight: "8px" }} fontSize="small" />
              {"Copy"}
            </div>
          ) : (
            <CheckIcon fontSize="small" />
          ),
      }}
      onPrimaryButtonClick={onCopyClick}
      onSecondaryButtonClick={onClose}
    />
  );
}
