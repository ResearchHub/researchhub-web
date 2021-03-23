import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";
import FsLightbox from "fslightbox-react";

// Component
import ColumnContainer from "./ColumnContainer";
import Button from "~/components/Form/Button";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

// Config
import { fetchPaperFigures } from "~/config/fetch";

const PaperPreview = (props) => {
  const { paperId } = props;
  const [slideIndex, setSlideIndex] = useState(1);
  const [figureUrls, setFigureUrls] = useState([]);
  const [lightbox, setLightbox] = useState(false);
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

  const toggleLightbox = () => {
    setLightbox(!lightbox);
  };

  return (
    <ColumnContainer
      overrideStyles={
        !fetching && !figureUrls.length ? styles.hidden : styles.container
      }
    >
      <ReactPlaceholder
        ready={!fetching}
        showLoadingAnimation
        customPlaceholder={<PreviewPlaceholder color="#efefef" />}
      >
        {figureUrls.length > 0 ? (
          <img
            src={figureUrls[0]}
            onClick={toggleLightbox}
            className={css(styles.preview)}
            property="image"
          />
        ) : null}
        {figureUrls.length > 0 ? (
          <FsLightbox
            toggler={lightbox}
            type="image"
            sources={figureUrls}
            slide={slideIndex}
          />
        ) : null}
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
