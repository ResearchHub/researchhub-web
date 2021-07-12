import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { isNullOrUndefined } from "../../../config/utils/nullchecks";
import PaperUploadV2Create from "./PaperUploadV2Create";
import PaperUploadV2Update from "./PaperUploadV2Update";

type Props = {};

function PaperUploadV2Container({  }: Props): ReactElement<"div"> {
  const router = useRouter();
  const { paperId, uploadPaperTitle, type } = router.query;
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
export default PaperUploadV2Container;
