import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Carousel from "nuka-carousel";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyState from "~/components/Placeholders/EmptyState";

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
    let paperId = this.props.paperId;
    fetch(API.GET_PAPER_FIGURES_ONLY({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({
          figures: res.data.map((el) => {
            return el.file;
          }),
        });
      });
  };

  setCurrentSlideIndex = (currentSlideIndex) => {
    this.setState({ currentSlideIndex });
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

  render() {
    return (
      <ComponentWrapper>
        <div className={css(styles.container)} id="figures-tab">
          <div className={css(styles.header)}>
            <div className={css(styles.sectionTitle)}>Figures</div>
            <span className={css(styles.count)}>
              {this.state.figures.length}
            </span>
          </div>
          <div className={css(styles.figuresWrapper)}>
            {this.state.figures.length > 0 ? (
              <Fragment>
                <div className={css(styles.figures)}>
                  <Carousel
                    outline={"none"}
                    wrapAround={true}
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
            ) : (
              <EmptyState
                text={"This paper has no figures yet"}
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
  container: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingBottom: 32,
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
    fontSize: 13,
    padding: "10px 16px",
    color: colors.BLUE(),
    border: `1px solid ${colors.BLUE()}`,
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      backgroundColor: colors.BLUE(),
      color: "#FFF",
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
});

export default FigureTab;
