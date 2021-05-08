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
          onClick={openPaperPDFModal}
          className={css(styles.preview, previewStyles)}
          property="image"
        />
      </ReactPlaceholder>
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    cursor: "pointer",
    width: "unset",
    marginLeft: "auto",

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
    width: 80,
    height: 90,
    objectFit: "contain",
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
