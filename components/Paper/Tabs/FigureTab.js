import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyState from "~/components/Placeholders/EmptyState";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

class FigureTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      figures: [],
      currentSlideIndex: 0,
      fetching: true,
    };
  }

  componentDidMount() {
    this.fetchFigures();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.paperId !== this.props.paperId) {
        this.fetchFigures();
      }
    }
  }

  fetchFigures = () => {
    this.setState({ fetching: true }, () => {
      let paperId = this.props.paperId;
      return fetch(API.GET_PAPER_FIGURES_ONLY({ paperId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          this.setState({
            figures: res.data.map((el) => {
              return el.file;
            }),
            fetching: false,
          });
        });
    });
  };

  setCurrentSlideIndex = (currentSlideIndex) => {
    this.setState({ currentSlideIndex });
  };

  toggleLightbox = () => {
    this.setState({ toggleLightbox: !this.state.toggleLightbox });
  };

  renderButton = (onClick, label) => {
    return (
      <div
        className={css(styles.button)}
        onClick={(e) => {
          e && e.stopPropagation();
          onClick(e);
        }}
      >
        {label && label}
      </div>
    );
  };

  renderContent = () => {
    let { fetching } = this.state;
    if (fetching) {
      return (
        <div className={css(styles.figures)}>
          <div className={css(styles.image)}>
            <ReactPlaceholder
              ready={false}
              showLoadingAnimation
              customPlaceholder={<PreviewPlaceholder color="#efefef" />}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <div className={css(styles.figures)} onClick={this.toggleLightbox}>
            <Carousel
              outline={"none"}
              wrapAround={true}
              className={css(styles.slider)}
              enableKeyboardControls={true}
              afterSlide={(slide) => this.setCurrentSlideIndex(slide)}
              renderBottomCenterControls={() => null}
              renderCenterLeftControls={(arg) => {
                let { previousSlide } = arg;
                return this.renderButton(previousSlide, "Prev");
              }}
              renderCenterRightControls={(arg) => {
                let { nextSlide } = arg;
                return this.renderButton(nextSlide, "Next");
              }}
            >
              {this.state.figures.map((figure) => {
                return <img src={figure} className={css(styles.image)} />;
              })}
            </Carousel>
          </div>
          <div className={css(styles.slideIndex)}>
            {`Figure ${this.state.currentSlideIndex + 1} `}
          </div>
        </Fragment>
      );
    }
  };

  render() {
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <div className={css(styles.container)} id="figures-tab">
          <div className={css(styles.header)}>
            <div className={css(styles.sectionTitle)}>Figures</div>
            <span className={css(styles.count)}>
              {this.state.figures.length}
            </span>
          </div>
          <div className={css(styles.figuresWrapper)}>
            {this.state.figures.length > 0 && (
              <FsLightbox
                toggler={this.state.toggleLightbox}
                type="image"
                sources={[...this.state.figures]}
                slide={this.state.slideIndex}
              />
            )}
            {this.state.figures.length > 0 ? (
              this.renderContent()
            ) : (
              <EmptyState
                text={"No Figures Found"}
                icon={<i class="fad fa-image"></i>}
                subtext={"No figures have been found in this paper's PDF"}
              />
            )}
          </div>
        </div>
      </ComponentWrapper>
    );
  }
}

const styles = StyleSheet.create({
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  container: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingBottom: 32,
  },
  slider: {
    outline: "none",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  count: {
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  figuresWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  figures: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    border: "none",
    border: 0,
  },
  image: {
    width: 300,
    height: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    outline: "none",
    border: "none",
    objectFit: "contain",
    "@media only screen and (max-width: 415px)": {
      width: 180,
    },
    "@media only screen and (max-width: 320px)": {
      width: 150,
    },
  },
  bottomControl: {
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 85,
    whiteSpace: "nowrap",
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    transition: "all ease-out 0.3s",
  },
  slideIndex: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    cursor: "pointer",
    fontSize: 14,
    padding: "10px 16px",
    color: "#FFF",
    border: `1px solid ${colors.BLUE()}`,
    backgroundColor: colors.BLUE(),
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      backgroundColor: "#3E43E8",
      color: "#FFF",
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      padding: "5px 8px",
    },
  },
});

export default FigureTab;
