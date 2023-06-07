import { ReactElement } from "react";
import QuickModal from "../../menu/QuickModal";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
type Props = { isOpen: boolean; onClose: () => void };

export default function ReferencesBibliographyModal({
  isOpen,
  onClose,
}: Props): ReactElement {
  return (
    <QuickModal
      isOpen={isOpen}
      modalContent={<div>"HIHI</div>}
      onClose={onClose}
      secondaryButtonConfig={{ remove: true }}
      primaryButtonConfig={{
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ContentCopyIcon sx={{ marginRight: "8px" }} fontSize="small" />
            {"Copy"}
          </div>
        ),
      }}
      onPrimaryButtonClick={(): void => {
        alert("COPY");
      }}
      onSecondaryButtonClick={silentEmptyFnc}
    />
  );
}
