import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
} from "../../../config/utils/nullchecks";
import PaperUploadV2Create from "./PaperUploadV2Create";
import PaperUploadV2Update from "./PaperUploadV2Update";

export default function PaperUploadV2Container(): ReactElement<"div"> {
  const router = useRouter();
  const { paperId, uploadPaperTitle, type } = router.query;
  const isUploadingNewPaper = isNullOrUndefined(paperId);
  return (
    <div className={css(styles.paperUploadV2Container)}>
      {"V2 - Text to be removed after testing"}
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
