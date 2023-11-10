import React, { ReactElement, useEffect, useState } from "react";
import BaseModal from "~/components/Modals/BaseModal";
import postUploadLibrary, {
  UploadLibraryEntryError,
} from "../api/postUploadLibrary";
import { nullthrows } from "~/config/utils/nullchecks";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { useOrgs } from "~/components/contexts/OrganizationContext";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";
import {
  ReferenceTableRowDataType,
  formatReferenceRowData,
} from "../reference_table/utils/formatReferenceRowData";
import { StyleSheet } from "aphrodite";
import IntroPage from "./pages/IntroPage";
import UploadingPage from "./pages/UploadingPage";
import ErrorPage from "./pages/ErrorPage";
import SuccessPage from "./pages/SuccessPage";

export type Props = {
  isOpen: boolean;
  onClose?: ({ success }: { success: boolean }) => void;
};

const ReferenceImportLibraryModal = ({
  isOpen,
  onClose,
}: Props): ReactElement => {
  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const { currentOrg } = useOrgs();
  const { activeProject } = useReferenceActiveProjectContext();

  const [page, setPage] = useState<"INTRO" | "UPLOADING" | "ERROR" | "SUCCESS">(
    "INTRO"
  );
  const [filenames, setFilenames] = useState<string[]>([]);

  const [uploadedReferences, setUploadedReferences] = useState<
    ReferenceTableRowDataType[]
  >([]);
  const [uploadErrors, setUploadErrors] = useState<UploadLibraryEntryError[]>([]);

  useEffect(() => {
    // Reset page when modal is closed/opened
    setPage("INTRO");
    setFilenames([]);
  }, [isOpen]);

  const onBibTeXFileDrop = (acceptedFiles: File[] | any[]): void => {
    if (acceptedFiles.length < 1) {
      return;
    }

    setFilenames(acceptedFiles.map((file) => file.name));
    setPage("UPLOADING");

    postUploadLibrary({
      acceptedFiles,
      activeProjectID: activeProject?.projectID ?? undefined,
      currentUser: nullthrows(currentUser),
      orgID: nullthrows(currentOrg).id,
      type: "bibtex",
      onSuccess: (refs, errors) => {
        setUploadedReferences(formatReferenceRowData(refs, [], null as any));
        setUploadErrors(errors);
        setPage("SUCCESS");
      },
      onError: () => {
        setPage("ERROR");
      },
    });
  };

  const handleClose = () => {
    if (onClose) {
      onClose({
        success: page === "SUCCESS",
      });
    }
  };

  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      zIndex={1000001}
      modalContentStyle={styles.modalContentStyle}
    >
      {page === "INTRO" && <IntroPage handleFileDrop={onBibTeXFileDrop} />}
      {page === "UPLOADING" && <UploadingPage filenames={filenames} />}
      {page === "ERROR" && (
        <ErrorPage filenames={filenames} onClose={handleClose} />
      )}
      {page === "SUCCESS" && (
        <SuccessPage
          references={uploadedReferences}
          errors={uploadErrors}
          onClose={handleClose}
        />
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    maxWidth: 550,

    "@media only screen and (min-width: 768px)": {
      width: 550,
    },
  },
  modalContentStyle: {
    padding: 40,
    paddingBottom: 25,
  },
});

export default ReferenceImportLibraryModal;
