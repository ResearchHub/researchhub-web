import { css } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "~/config/themes/colors";
import { BarLoader } from "react-spinners";
import sharedStyles from "./sharedStyles";

const UploadingPage = ({
  filenames,
}: {
  filenames: string[];
}): ReactElement => (
  <div
    className={css([sharedStyles.container, sharedStyles.extraBottomPadding])}
  >
    <div className={css(sharedStyles.header)}>
      <div className={css(sharedStyles.title)}>Importing Library</div>
      <div className={css(sharedStyles.subtitle)}>
        We&apos;re uploading and processing your references. This can take a few minutes.
      </div>
    </div>
    <div className={css(sharedStyles.listContainer)}>
      <div className={css(sharedStyles.listHeader)}>
        <div className={css(sharedStyles.listTitle)}>
          Importing {filenames.length} file{filenames.length !== 1 && "s"}
        </div>
      </div>
      <div className={css(sharedStyles.barLoaderContainer)}>
        <BarLoader
          widthUnit="%"
          width={100}
          color={colors.NEW_BLUE_HEX}
          loading={true}
          speedMultiplier={0.5}
        />
      </div>
      <div className={css(sharedStyles.fileList)}>
        {filenames.map((filename) => (
          <div className={css(sharedStyles.fileItem)} key={filename}>
            {filename}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UploadingPage;
