import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import ColumnContainer from "./ColumnContainer";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import { fetchPaperFigures } from "~/config/fetch";
import { absoluteUrl } from "../../../config/utils";

const PaperPreview = ({ paperId, previewStyles, columnOverrideStyles }) => {
  const dispatch = useDispatch();
  const [figureUrls, setFigureUrls] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchFigures();
  }, [paperId]);

  const fetchFigures = () => {
    if (paperId) {
      setFetching(true);
      return fetchPaperFigures(paperId).then((res) => {
        const { data } = res;
        setFigureUrls(data.map((preview) => preview.file));
        setFetching(false);
      });
    }
  };

  const openPaperPDFModal = (e) => {
    e && e.stopPropagation();
    return dispatch(ModalActions.openPaperPDFModal(true));
  };

  return (
    <ColumnContainer
      overrideStyles={[
        !fetching && !figureUrls.length ? styles.hidden : styles.container,
        columnOverrideStyles,
        fetching && styles.fetching,
      ]}
      onClick={openPaperPDFModal}
    >
      <ReactPlaceholder
        ready={!fetching}
        showLoadingAnimation
        customPlaceholder={
          <PreviewPlaceholder previewStyles={previewStyles} color="#efefef" />
        }
      >
        <img
          src={figureUrls[0]}
          className={css(styles.preview, previewStyles)}
          property="image"
        />
        {/* <div className={css(styles.preview)}>
        test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test 
        </div> */}
      </ReactPlaceholder>
    </ColumnContainer>
  );
  // return (
  //   <img
  //     src={figureUrls[0]}
  //     onClick={openPaperPDFModal}
  //     className={css(styles.preview, previewStyles)}
  //     property="image"
  //   />
  // );

  // return (
  //   <div className={css(styles.preview)}>
  //     test test test test test test test test test test test test test test test
  //     test test test test test test test test test test test test test test test
  //     test test test test test test test test test test test
  //   </div>
  // );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    cursor: "pointer",
    width: "unset",
    marginLeft: "auto",

    display: "flex",
    flex: "1 1 0px",
    // width: "120px",
    overflowY: "hidden", // trims bottom
    overflowX: "hidden",
    justifyContent: "center",

    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  fetching: {
    border: "none",
  },
  hidden: {
    display: "none",
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    // width: 100,
    // height: "120px",
    // width: 120,
    // height: 180,
    // height: "inherit",
    // width: "100%",
    // height: "100%",
    // objectFit: "fill",
    // flex: "1 1 0px",
    // width: "120px",

    // maxWidth: "120px",
    // height: "100%",
    // overflowY: "hidden",
    // overflowX: "hidden",
    // maxWidth: "100%",
    // maxHeight: "100%",
    // width: "100%",
    // objectFit: "cover",
    // alignSelf: "center",
    // flex: "1",
    // minHeight: 0,
    // maxWidth: "100%",
    // maxHeight: "100%",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    zIndex: 4,
  },
});

export default PaperPreview;
