import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ModalActions } from "~/redux/modals";
import { nullthrows } from "~/config/utils/nullchecks";
import { useContext, useEffect, useState } from "react";
import colors from "~/config/themes/colors";
import ProgressBar from "@ramonak/react-progress-bar";
import withWebSocket from "~/components/withWebSocket";
import icons from "~/config/themes/icons";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "~/components/contexts/NewPostButtonContext";

type Props = {
  modalActions: any /* redux */;
  onExit: () => void;
  wsResponse: any;
};
const TWENTY_FIVE_SEC = 25000;

const FAKE_PERCENTS = [
  2, 7, 11, 13, 24, 28, 32, 50, 55, 63, 70, 81, 83, 85, 88, 89, 91,
];

const timeLoop = ({
  loadIndex,
  setLoadIndex,
  setLoadRef,
  time,
}: {
  loadIndex: number;
  setLoadIndex: (ind: number) => void;
  setLoadRef: (ref: NodeJS.Timeout) => void;
  time: number;
}) => {
  setLoadRef(
    setTimeout((): void => {
      if (loadIndex === -1) {
        setLoadIndex(-1); // keeps the bar in sync
        return;
      }

      const nextloadIndex = loadIndex + 1;
      if (nextloadIndex < FAKE_PERCENTS.length) {
        setLoadIndex(nextloadIndex);
        timeLoop({ loadIndex: nextloadIndex, setLoadIndex, setLoadRef, time });
      }
    }, time)
  );
};

function PaperUploadWizardStandbyBody({
  modalActions,
  onExit,
  wsResponse,
}: Props) {
  const { values: uploaderContextValues, setValues: setUploaderContextValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const [loadIndex, setLoadIndex] = useState<number>(0);
  const [loadRef, setLoadRef] = useState<NodeJS.Timeout | null>(null);
  const [askRedirect, setAskRedirect] = useState<boolean>(false);

  const parsedWsResponse = JSON.parse(wsResponse);
  const wsData = parsedWsResponse?.data ?? {};
  const {
    doi = null,
    paper: postedPaperID,
    paper_status: uploadStatus,
  } = wsData;

  useEffect(() => {
    timeLoop({ loadIndex, setLoadIndex, setLoadRef, time: 1200 });
    setTimeout((): void => setAskRedirect(true), TWENTY_FIVE_SEC);
  }, []);

  useEffect((): void => {
    if (uploadStatus === "COMPLETE") {
      setLoadIndex(-1);
      clearTimeout(nullthrows(loadRef, "Attempting to clear null ref"));
      setTimeout((): void => {
        setUploaderContextValues({
          ...uploaderContextValues,
          doi: doi,
          paperID: postedPaperID,
          wizardBodyType: "posted_paper_update",
        });
      }, 1600);
    } else if (uploadStatus === "FAILED_DUPLICATE") {
      modalActions.openUploadPaperModal(
        true,
        parsedWsResponse?.duplicate_papers ?? []
      );
      onExit();
    }
  }, [uploadStatus, postedPaperID]);

  const percent = FAKE_PERCENTS[loadIndex] ?? 100;
  const shouldRenderDelayText =
    !["COMPLETE", "FAILED_DUPLICATE"].includes(uploadStatus) && askRedirect;
  const progressText =
    uploadStatus === "PROCESSING"
      ? "Initiating ..."
      : uploadStatus === "PROCESSING_MANUBOT"
      ? "Importing from source ..."
      : uploadStatus === "PROCESSING_CROSSREF"
      ? "Cross referencing ..."
      : uploadStatus === "COMPLETE"
      ? "Done"
      : "Processing ...";
  const didProcessFail = ["FAILED", "FAILED_DOI"].includes(uploadStatus);

  return (
    <div className={css(styles.wizardStandby)}>
      {!didProcessFail ? (
        <div className={css(styles.wizardStandbyBox)}>
          <div className={css(styles.title)}>{"Uploading a paper"}</div>
          <div className={css(styles.statusText)}>
            <div>{progressText}</div>
            <div>{`${percent}%`}</div>
          </div>
          <ProgressBar
            bgColor={colors.GREEN(1)}
            baseBgColor={colors.LIGHT_GREY(1)}
            className={css(styles.progreeBar)}
            completed={percent}
            height="8px"
            customLabel=" "
          />
          {shouldRenderDelayText && (
            <div className={css(styles.loadText)}>
              <div>
                {
                  "It's taking longer than expected. We'll send you a notification when the process is finished"
                }
              </div>
              <div
                style={{ color: colors.BLUE(1), cursor: "pointer" }}
                onClick={onExit}
              >
                {"exit"}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={css(styles.wizardStandbyFailBox)}>
          <div className={css(styles.failedTitle)}>
            <span
              style={{
                marginRight: 6,
                color: colors.RED(1),
              }}
            >
              {icons.exclamationCircle}
            </span>
            {"We weren't able to import your paper"}
          </div>
          <div className={css(styles.failedBody)}>
            <span>{"Please try again by loading with "}</span>
            <div
              onClick={(): void =>
                setUploaderContextValues({
                  ...uploaderContextValues,
                  wizardBodyType: "pdf_upload",
                })
              }
              style={{
                color: colors.BLUE(),
                cursor: "pointer",
                margin: "0 4px",
              }}
            >
              {"PDF"}
            </div>
            <span>{" or "}</span>
            <span
              onClick={(): void =>
                setUploaderContextValues({
                  ...uploaderContextValues,
                  wizardBodyType: "doi_upload",
                })
              }
              style={{
                color: colors.BLUE(),
                cursor: "pointer",
                margin: "0 4px",
              }}
            >
              {" DOI "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(PaperUploadWizardStandbyBody)
);

const styles = StyleSheet.create({
  wizardStandby: { marginTop: 32, width: "100%" },
  wizardStandbyBox: {
    backgroundColor: colors.LIGHTER_GREY(0.5),
    borderRadius: 3,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: 142,
    padding: "16px 32px",
    width: "100%",
    marginBottom: 16,
  },
  wizardStandbyFailBox: {
    alignItems: "center",
    background: colors.ERROR_BACKGROUND(0.1),
    borderRadius: 3,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: 80,
    justifyContent: "center",
    margin: "auto",
    padding: "16px",
    width: "100%",
  },
  failedTitle: {
    color: colors.ERROR_BACKGROUND(),
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
    justifyContent: "center",
    width: "100%",
  },
  failedBody: {
    display: "flex",
    fontSize: 14,
    justifyContent: "center",
    marginTop: 4,
    width: "100%",
  },
  loadText: {
    color: colors.TEXT_DARKER_GREY,
    fontSize: 12,
    fontWeight: 400,
    margin: "12px 0",
    display: "flex",
    justifyContent: "space-between",
  },
  progreeBar: { width: "100%" },
  title: {
    fontSize: 20,
    fontWeight: 500,
    paddingBottom: 8,
    marginBottom: 16,
    borderBottom: `1px solid ${colors.LIGHT_GREY(1)}`,
  },
  statusText: {
    color: colors.TEXT_DARKER_GREY,
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
  },
});
