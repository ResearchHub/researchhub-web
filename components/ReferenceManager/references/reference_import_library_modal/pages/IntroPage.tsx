import { css } from "aphrodite";
import React, { ReactElement } from "react";
import UploadFileDragAndDrop from "~/components/UploadFileDragAndDrop";
import sharedStyles from "./sharedStyles";

const IntroPage = ({
  handleFileDrop,
}: {
  handleFileDrop: (acceptedFiles: File[]) => void;
}): ReactElement => (
  <div
    className={css([sharedStyles.container, sharedStyles.extraBottomPadding])}
  >
    <div className={css(sharedStyles.header)}>
      <div className={css(sharedStyles.title)}>Import library</div>
      <div className={css(sharedStyles.subtitle)}>
        Import your existing references in BibTeX (.bib) format.
      </div>
    </div>
    <UploadFileDragAndDrop
      accept=".bib"
      handleFileDrop={handleFileDrop}
      fileTypeString="files"
    />
  </div>
);

export default IntroPage;
