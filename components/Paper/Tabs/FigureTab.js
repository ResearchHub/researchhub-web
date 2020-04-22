import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Carousel from "nuka-carousel";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";

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
                    wrapAround={true}
                    enableKeyboardControls={true}
                    afterSlide={(slide) => this.setCurrentSlideIndex(slide)}
                    renderBottomCenterControls={() => null}
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
              <div className={css(styles.citationEmpty)}>
                <div className={css(styles.icon)}>
                  <i className="fad fa-file-alt" />
                </div>
                This paper has no figures yet
                <div className={css(styles.citationEmptySubtext)}>
                  No figures have been found in RH papers
                </div>
              </div>
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
  },
  image: {
    width: 300,
    marginRight: "auto",
    marginLeft: "auto",
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
    marginBottom: 20,
    // opacity: 0,
    fontSize: 14,
    transition: "all ease-out 0.3s",
  },
  slideIndex: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  citationEmpty: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: "rgb(78, 83, 255)",
    height: 50,
    marginBottom: 25,
  },
  citationEmptySubtext: {
    fontSize: 16,
    color: "rgba(36, 31, 58, 0.8)",
    fontWeight: 400,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
});

export default FigureTab;
