import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, ReactNode, SyntheticEvent, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import withWebSocket from "../withWebSocket";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { ID } from "~/config/types/root_types";
import { ForceOpen } from "../Paper/UploadWizard/PaperUploadWizardContainer";
import { buildSlug } from "~/config/utils/buildSlug";

type Props = {
  wsResponse: any /* socket */;
  setForceOpenPaperUpload: (args: ForceOpen) => void;
  isNewPostModalOpen: boolean;
};
type GetToastBodyArgs = {
  status: string;
  paperID: ID;
  setForceOpenPaperUpload;
  router: NextRouter;
};

const getToastBody = ({
  status,
  paperID,
  setForceOpenPaperUpload,
  router,
}: GetToastBodyArgs): [
  boolean /* shouldRender */,
  ReactNode /* toastBody */
] => {
  switch (status) {
    case "COMPLETE":
      return [
        true,
        <div
          className={css(styles.toastBody)}
          onClick={(_event: SyntheticEvent): void => {router.push(`/paper/${paperID}/${buildSlug()}`)}}
        >
          <div className={css(styles.toastBodyTitle)}>{"PAPER UPLOADED"}</div>
          <div className={css(styles.toastSubtext)}>
            <span style={{ marginRight: 6, color: colors.GREEN(1) }}>
              {icons.checkCircle}
            </span>
            {"Click here to complete next steps"}
          </div>
        </div>,
      ];
    case "PROCESSING":
    case "PROCESSING_MANUBOT":
    case "FAILED_DUPLICATE":
      return [
        true,
        <div className={css(styles.toastBody)}>
          <div className={css(styles.toastBodyTitle)}>
            {"PAPER UPLOADED FAILED"}
          </div>
          <div className={css(styles.toastSubtext)}>
            <span style={{ marginRight: 6, color: colors.RED(1) }}>
              {icons.exclamationCircle}
            </span>
            {"Please try again later or upload with a PDF"}
          </div>
        </div>,
      ];
    default:
      return [false, null];
  }
};

function PaperUploadStateNotifier({
  wsResponse,
  setForceOpenPaperUpload,
  isNewPostModalOpen,
}: Props): ReactElement<typeof ToastContainer> {
  const router = useRouter();
  const parsedWsResponse = JSON.parse(wsResponse);
  const { paper_status: paperUploadStatus, paper: paperID } =
    parsedWsResponse?.data ?? {};
  console.warn("JSON.parse(wsResponse: ", JSON.parse(wsResponse)?.data);
  console.warn("isNewPostModalOpen: ", isNewPostModalOpen);
  useEffect((): void => {
    const bodyResult = getToastBody(
      paperID,
      paperUploadStatus,
      router,
      setForceOpenPaperUpload
    );
    console.warn("inside useEffect", bodyResult);
    if (bodyResult[0] && !isNewPostModalOpen) {
      console.warn("TOSTING: ", bodyResult[1], []);
      toast(bodyResult[1]);
    }
  }, [paperUploadStatus, paperID, isNewPostModalOpen]);

  return (
    <ToastContainer
      autoClose={false}
      closeOnClick
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-right"
      rtl={false}
    />
  );
}

const styles = StyleSheet.create({
  toastBody: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: 8,
  },
  toastBodyTitle: {
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
    paddingBottom: 4,
  },
  toastSubtext: {
    fontSize: 12,
    fontWeight: 400,
    marginTop: 4,
  },
});
const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(PaperUploadStateNotifier)
);
