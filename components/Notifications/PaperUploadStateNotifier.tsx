import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { ReactElement, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import withWebSocket from "../withWebSocket";

type Props = { wsResponse: any /* socket */ };

function PaperUploadStateNotifier({
  wsResponse,
}: Props): ReactElement<typeof ToastContainer> {
  console.warn("wsResponse: ", wsResponse);
  const router = useRouter();
  useEffect((): void => {
    toast("Preparing paper");
  }, []);

  return (
    <ToastContainer
      autoClose={false}
      closeOnClick
      draggable
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
