import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Router from "next/router";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import Link from "next/link";
import "./CitationCard.css";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import HubTag from "~/components/Hubs/HubTag";
import PreviewPlaceholder from "../Placeholders/PreviewPlaceholder";

// Redux
import { MessageActions } from "~/redux/message";

import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

class CitationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      figureUrls: [],
      toggleLightbox: false,
      fetchingPreview: false,
    };
  }

  componentDidMount() {
    let { citation } = this.props;
    let paperId = citation.id;
    this.fetchFigures(paperId);
  }

  fetchFigures = (paperId) => {
    this.setState({ fetchingPreview: true }, () => {
      fetch(API.GET_PAPER_FIGURES({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.setState({
            previews: res.data,
            figureUrls: res.data.map((preview, index) => preview.file),
            fetchingPreview: false,
          });
        })
        .catch((err) => {
          this.setState({
            fetchingPreview: false,
          });
        });
    });
  };

  setHover = () => {
    !this.state.hovered && this.setState({ hovered: true });
  };

  unsetHover = () => {
    this.state.hovered && this.setState({ hovered: false });
  };

  toggleLightbox = () => {
    this.setState({ toggleLightbox: !this.state.toggleLightbox });
  };

  checkIsPublic = () => {
    let { citation, setMessage, showMessage } = this.props;
    showMessage({ show: true, load: true });
    let paperId = citation.id;
    if (!citation.is_public) {
      fetch(API.MAKE_PAPER_PUBLIC({ paperId }))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.navigateToPage();
        })
        .catch((err) => {
          showMessage({ show: false });
          setMessage("Something went wrong.");
          showMessage({ show: true, error: true });
        });
    } else {
      this.navigateToPage();
    }
  };

  getHref = () => {
    let { citation } = this.props;
    let paperId = citation.id;
    return `/paper/${paperId}/summary`;
  };

  navigateToPage = () => {
    let { citation, showMessage } = this.props;
    let paperId = citation.id;
    Router.push("/paper/[paperId]/[tabName]", `/paper/${paperId}/summary`);
    setTimeout(() => {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      showMessage({ show: false });
    }, 400);
  };

  renderPreview = () => {
    let { hovered, fetchingPreview, previews } = this.state;
    if (fetchingPreview) {
      return (
        <div
          className={css(carousel.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PreviewPlaceholder color="#efefef" />}
          />
        </div>
      );
    }
    if (!fetchingPreview && previews.length > 0) {
      return (
        <div
          className={css(carousel.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel
            renderBottomCenterControls={(arg) => {
              let { currentSlide, slideCount, previousSlide, nextSlide } = arg;
              return (
                <div
                  className={css(
                    carousel.bottomControl,
                    hovered && carousel.show
                  )}
                >
                  <span
                    onClick={previousSlide}
                    className={css(
                      carousel.button,
                      carousel.left,
                      hovered && carousel.show
                    )}
                  >
                    <i className="far fa-angle-left" />
                  </span>
                  {`${currentSlide + 1} / ${slideCount}`}
                  <span
                    onClick={nextSlide}
                    className={css(
                      carousel.button,
                      carousel.right,
                      hovered && carousel.show
                    )}
                  >
                    <i className="far fa-angle-right" />
                  </span>
                </div>
              );
            }}
            renderCenterLeftControls={null}
            renderCenterRightControls={null}
            wrapAround={true}
          >
            {this.state.previews.map((preview) => {
              return (
                <img
                  src={preview.file}
                  onClick={this.toggleLightbox}
                  className={css(styles.image)}
                />
              );
            })}
          </Carousel>
        </div>
      );
    }
  };

  renderHubs = () => {
    let { citation } = this.props;
    let hubs =
      citation &&
      citation.hubs.map((hub, index) => {
        return (
          <span className={css(styles.hubtag)}>
            <HubTag tag={hub} gray={true} />
          </span>
        );
      });
    return hubs;
  };

  render() {
    let { figureUrls, toggleLightbox } = this.state;
    let { citation } = this.props;

    return (
      <a className={css(styles.link)} href={this.getHref()}>
        <div className={css(styles.card)} onClick={this.checkIsPublic}>
          {figureUrls.length > 0 && (
            <span onClick={(e) => e.stopPropagation()}>
              <FsLightbox
                toggler={toggleLightbox}
                type="image"
                sources={[...figureUrls]}
              />
            </span>
          )}
          {this.renderPreview()}
          <div className={css(styles.title)} id={"clamp"}>
            {citation.title && citation.title}
          </div>
          <div className={css(styles.hubs)}>{this.renderHubs()}</div>
        </div>
      </a>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: "unset",
    textDecoration: "unset",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    cursor: "pointer",
    marginRight: 30,
  },
  preview: {},
  image: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: 240,
    minHeight: 240,
    maxHeight: 240,
    objectFit: "fill",
    "@media only screen and (max-width: 1280px)": {},
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    lineClamp: 3,
    webkitLineClamp: 3,
    fontSize: 16,
    fontWeight: 500,
    color: "#241F3A",
    width: 220,
    minWidth: 220,
    maxWidth: 220,
    ":hover": {
      textDecoration: "underline",
    },
  },
  hubs: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 220,
    minWidth: 220,
    maxWidth: 220,
    flexWrap: "wrap",
    marginTop: 12,
  },
  hubtag: {
    marginRight: 5,
    marginBottom: 5,
  },
});

const carousel = StyleSheet.create({
  previewContainer: {
    minWidth: 160,
    width: 160,
    height: 240,
    minHeight: 240,
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    marginRight: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    marginBottom: 15,
    "@media only screen and (max-width: 1280px)": {
      minWidth: 200,
      width: 200,
      maxWidth: 200,
    },
  },
  bottomControl: {
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 85,
    color: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    opacity: 0,
    fontSize: 14,
    transition: "all ease-out 0.3s",
  },
  button: {
    border: 0,
    textTransform: "uppercase",
    cursor: "pointer",
    opacity: 0,
    transition: "all ease-out 0.3s",
    fontSize: 18,
    userSelect: "none",
    paddingTop: 1,
    color: "rgba(255, 255, 255, 0.45)",
    ":hover": {
      color: "#FFF",
    },
  },
  left: {
    marginLeft: 8,
    marginRight: 5,
  },
  right: {
    marginRight: 8,
    marginLeft: 5,
  },
  pointer: {
    cursor: "not-allowed",
  },
  show: {
    opacity: 1,
  },
});

// const mapStateToProps = (state) => ({

// });

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  null,
  mapDispatchToProps
)(CitationCard);
