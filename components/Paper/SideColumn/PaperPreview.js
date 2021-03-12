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
  const { paperId, paper } = props;
  const [slideIndex, setSlideIndex] = useState(1);
  const [figureUrls, setFigureUrls] = useState([]);
  const [lightbox, setLightbox] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchFigures();
  }, [paperId, paper]);

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

  const renderLightbox = () => {
    return (
      figureUrls.length > 0 && (
        <FsLightbox
          toggler={lightbox}
          type="image"
          sources={figureUrls}
          slide={slideIndex}
        />
      )
    );
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
        {figureUrls.length > 0 && (
          <img
            src={figureUrls[0]}
            onClick={toggleLightbox}
            className={css(styles.preview)}
            property="image"
          />
        )}
        {renderLightbox()}
        <div className={css(styles.blur)} onClick={toggleLightbox} />
        <div className={css(styles.buttonContainer)}>
          <Button label={"Read Paper"} onClick={() => toggleLightbox()} />
        </div>
      </ReactPlaceholder>
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: "relative",
    cursor: "pointer",
  },
  hidden: {
    display: "none",
  },
  preview: {
    width: "100%",
    height: 250,
    objectFit: "contain",
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 86.38%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
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
