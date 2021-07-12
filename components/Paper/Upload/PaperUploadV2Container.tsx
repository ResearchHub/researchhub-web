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
      <form>
        <div className={css(styles.pageContent)}>
          {isUploadingNewPaper ? (
            <PaperUploadV2Create />
          ) : (
            <PaperUploadV2Update />
          )}
        </div>
      </form>
    </div>
  );
}

const styles = StyleSheet.create({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
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
  pageContent: {
    position: "relative",
    backgroundColor: "#FFF",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "30px 60px",
    marginTop: 40,
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
      marginTop: 16,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    "@media only screen and (max-width: 415px)": {
      borderTop: "unset",
    },
  },
});
