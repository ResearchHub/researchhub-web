import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
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
import { formatPaperSlug } from "~/config/utils";

class CitationCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      figureUrls: [],
      toggleLightbox: false,
      fetchingPreview: true,
    };
  }

  componentDidMount() {
    let { citation } = this.props;
    let { first_figure, first_preview } = citation;
    let previews = [first_preview, first_figure].filter((el) => el !== null);
    this.setState({
      previews: previews,
      figureUrl: previews.map((preview, index) => preview.file),
      fetchingPreview: false,
    });
  }

  setHover = () => {
    !this.state.hovered && this.setState({ hovered: true });
  };

  unsetHover = () => {
    this.state.hovered && this.setState({ hovered: false });
  };

  toggleLightbox = () => {
    this.setState({ toggleLightbox: !this.state.toggleLightbox });
  };

  getHref = () => {
    let { citation } = this.props;
    let paperId = citation.id;
    let title = citation.paper_title ? citation.paper_title : citation.title;
    return `/paper/${paperId}/${formatPaperSlug(title)}`;
  };

  renderPreview = () => {
    let { hovered, fetchingPreview, previews } = this.state;
    if (fetchingPreview) {
      return (
        <div
          className={css(carousel.previewContainer)}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PreviewPlaceholder color="#efefef" />}
          >
            <div />
          </ReactPlaceholder>
        </div>
      );
    }
    if (previews.length > 0) {
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
                  alt="Paper Preview"
                />
              );
            })}
          </Carousel>
        </div>
      );
    } else {
      return (
        <div
          className={css(carousel.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation={false}
            customPlaceholder={
              <PreviewPlaceholder hideAnimation={true} color="#efefef" />
            }
          />
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
          <span
            key={`hub_${index}_${citation.id}`}
            className={css(styles.hubtag)}
          >
            <HubTag tag={hub} gray={false} />
          </span>
        );
      });
    return hubs;
  };

  renderCitation = () => {
    let { figureUrls, toggleLightbox } = this.state;
    let { citation } = this.props;

    return (
      <div
        className={css(styles.card)}
        onMouseEnter={this.setHover}
        onMouseLeave={this.unsetHover}
      >
        <Link href={"/paper/[paperId]/[paperName]"} as={this.getHref()}>
          <a className={css(styles.link)}>
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
          </a>
        </Link>
        <div className={css(styles.hubs)}>{this.renderHubs()}</div>
      </div>
    );
  };

  render() {
    return <Fragment>{this.renderCitation()}</Fragment>;
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
    height: 220,
    minHeight: 220,
    maxHeight: 220,
    objectFit: "fill",
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
  emptyState: {
    zIndex: 2,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyStateIcon: {
    fontSize: 50,
  },
  emptyStateText: {
    fontSize: 12,
  },
});

const carousel = StyleSheet.create({
  previewContainer: {
    minWidth: 160,
    width: 160,
    height: 220,
    minHeight: 220,
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    marginRight: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    marginBottom: 15,
    position: "relative",
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
