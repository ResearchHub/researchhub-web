import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import FsLightbox from "fslightbox-react";

// Component
import ColumnContainer from "./ColumnContainer";
import Button from "~/components/Form/Button";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

// Config
import colors from "~/config/themes/colors";
import { fetchPaperFigures } from "~/config/fetch";

const PaperPreview = (props) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [figureUrls, setFigureUrls] = useState([
    "https://researchhub-paper-prod.s3.amazonaws.com/uploads/figures/2021/02/18/887494-0.jpg?AWSAccessKeyId=AKIA3RZN3OVNPLBMN3JX&Signature=0MPRfrfJ73vgn1bznPx5Rs9eXEM%3D&Expires=1614286622",
  ]);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchFigures();
  }, [props.paperId]);

  const fetchFigures = () => {
    const paperId = props.paperId;

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
    <ColumnContainer overrideStyles={styles.container}>
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
