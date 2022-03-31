import "react-toastify/dist/ReactToastify.css";
import { buildSlug } from "~/config/utils/buildSlug";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ID, NullableString } from "~/config/types/root_types";
import { NextRouter, useRouter } from "next/router";
import {
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useContext,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import withWebSocket from "../withWebSocket";
import {
  NewPostButtonContext,
  NewPostButtonContextType,
} from "../contexts/NewPostButtonContext";

type Props = {
  wsResponse: any /* socket */;
  isNewPostModalOpen: boolean;
};
type GetToastBodyArgs = {
  paperID: ID;
  paperUploadStatus: NullableString;
  router: NextRouter;
};

const getToastBody = ({
  paperUploadStatus,
  paperID,
  router,
}: GetToastBodyArgs): [
  boolean /* shouldRender */,
  ReactNode /* toastBody */
] => {
  switch (paperUploadStatus) {
    case "COMPLETE":
      return [
        true,
        <div
          className={css(styles.toastBody)}
          onClick={(_event: SyntheticEvent): void => {
            router.push(`/paper/${paperID}/new-upload`);
          }}
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
}: Props): ReactElement<typeof ToastContainer> {
  const router = useRouter();
  const { values: uploadButtonValues, setValues: setUploadButtonValues } =
    useContext<NewPostButtonContextType>(NewPostButtonContext);
  const { isOpen: isUploadModalOpen, paperID: currentUploadingPaperID } =
    uploadButtonValues;
  const parsedWsResponse = JSON.parse(wsResponse);
  const {
    paper_status: paperUploadStatus,
    paper: msgPaperID,
    status_read: isNotificationRead,
  } = parsedWsResponse?.data ?? {};
  console.warn("JSON.parse(wsResponse: ", JSON.parse(wsResponse)?.data);

  useEffect((): void => {
    if (!isNotificationRead) {
      const paperIDsMatch = msgPaperID === currentUploadingPaperID;
      if (isUploadModalOpen && paperIDsMatch) {
        /* mark notification as read  & dont show notification */
        console.warn("mark notification as read  & dont show notification");
      } else {
        const bodyResult = getToastBody({
          paperID: msgPaperID,
          paperUploadStatus,
          router,
        });
        bodyResult[0] && toast(bodyResult[1]);
      }
    }
  }, [
    currentUploadingPaperID,
    isNotificationRead,
    isUploadModalOpen,
    msgPaperID,
    paperUploadStatus,
  ]);

  return (
    <ToastContainer
      autoClose={false}
      closeOnClick
      hideProgressBar={false}
      limit={1} /* render only 1 at a time */
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
