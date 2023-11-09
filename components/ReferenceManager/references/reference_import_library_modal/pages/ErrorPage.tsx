import { css } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/Form/Button";
import { faCircleExclamation } from "@fortawesome/pro-regular-svg-icons";
import sharedStyles from "./sharedStyles";

const ErrorPage = ({
  filenames,
  onClose,
}: {
  filenames: string[];
  onClose: () => void;
}): ReactElement => (
  <div className={css(sharedStyles.container)}>
    <div className={css(sharedStyles.header)}>
      <div className={css(sharedStyles.title)}>Import Failed</div>
      <div className={css(sharedStyles.subtitle)}>
        There was an error importing your references. Please try again.
      </div>
    </div>
    <div className={css(sharedStyles.listContainer)}>
      <div className={css(sharedStyles.listHeader)}>
        <FontAwesomeIcon
          style={{ fontSize: 16 }}
          icon={faCircleExclamation}
          color={colors.RED_DARK()}
        ></FontAwesomeIcon>
        <div className={css(sharedStyles.listTitle)}>
          {filenames.length} file{filenames.length !== 1 && "s"} failed
        </div>
      </div>
      <div className={css(sharedStyles.fileList)}>
        {filenames.map((filename) => (
          <div className={css(sharedStyles.fileItem)} key={filename}>
            {filename}
          </div>
        ))}
      </div>
    </div>
    <div className={css(sharedStyles.footer)}>
      <Button
        label="Close"
        type="primary"
        onClick={onClose}
        customButtonStyle={sharedStyles.footerButton}
      />
    </div>
  </div>
);

export default ErrorPage;
