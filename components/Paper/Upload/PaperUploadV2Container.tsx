import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import { useRouter } from "next/router";
import PaperUploadV2Create from "./PaperUploadV2Create";
import PaperUploadV2Update from "./PaperUploadV2Update";
import { ReactElement } from "react";

export default function PaperUploadV2Container(): ReactElement<"div"> {
  const router = useRouter();
  const { paperId } = router.query;
  const isUploadingNewPaper = isNullOrUndefined(paperId);
  return (
    <div className={css(styles.paperUploadV2Container)}>
      {isUploadingNewPaper ? <PaperUploadV2Create /> : <PaperUploadV2Update />}
    </div>
  );
}

const styles = StyleSheet.create({
  paperUploadV2Container: {
    backgroundColor: "#FCFCFC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    scrollBehavior: "smooth",
    position: "relative",
    minHeight: "100vh",
  },
});
