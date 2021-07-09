import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";

type Props = {};

function PaperUploadV2({  }: Props): ReactElement<"div"> {
  const router = useRouter();
  const { paperId } = router.query;
  return (
    <div>
      Hi this is paper upload v2
      <a>nice to meet you</a>
    </div>
  );
}

export default PaperUploadV2;
