import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { ReactElement, ReactNode, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import withWebSocket from "../withWebSocket";

type Props = { wsResponse: any /* socket */ };

// const AUTO_CLOSE_MAP = {
//   COMPLETE: false,
//   FAILED_DUPLICATE: false,
//   PROCESSING_MANUBOT: true,
//   PROCESSING: true,
// };

const getToastBody = (
  status: string,
  paperName: string | null
): [boolean /* shouldRender */, ReactNode /* toastBody */] => {
  switch (status) {
    case "COMPLETE":
      return [
        true,
        <div>
          <div>{"PAPER UPLOAD COMPLETE"}</div>
        </div>,
      ];
    case "PROCESSING":
    case "PROCESSING_MANUBOT":
    case "FAILED_DUPLICATE":
    default:
      return [false, null];
  }
};

function PaperUploadStateNotifier({
  wsResponse,
}: Props): ReactElement<typeof ToastContainer> {
  const router = useRouter();
  const parsedWsResponse = JSON.parse(wsResponse);
  const { paper_status: paperUploadStatus, paper: paperID } =
    parsedWsResponse?.data ?? {};
  console.warn("JSON.parse(wsResponse: ", JSON.parse(wsResponse)?.data);

  useEffect((): void => {
    const bodyResult = getToastBody(paperUploadStatus, "THIS IS PAPER NAME");
    console.warn("inside useEffect", bodyResult);
    if (bodyResult[0]) {
      console.warn("TOSTING: ", bodyResult[1], []);
      toast("YO", {
        onClose: (): void => {
          router.push(`/paper/${68}`);
        },
      });
    }
  }, [paperUploadStatus, paperID]);

  return (
    <ToastContainer
      autoClose={false}
      closeOnClick={false}
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-right"
      rtl={false}
    />
  );
}

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default withWebSocket(
  // @ts-ignore legacy hook
  connect(mapStateToProps, mapDispatchToProps)(PaperUploadStateNotifier)
);
