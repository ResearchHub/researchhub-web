import { Document, Page } from "react-pdf";
import { Fragment } from "react";
import Loader from "~/components/Loader/Loader";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

export default class PaperPdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageIndex: null,
      numPagesRendered: null,
      mobileView: false,
    };
  }

  componentDidMount() {
    this.setPdfWidth(window.innerWidth);
    // document.getElementById('pdfContainer').addEventListener('wheel', this.onScrollPDF.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.windowWidth !== this.props.windowWidth) {
        this.setPdfWidth();
      }
    }
    // document.getElementById('pdfContainer').removeEventListener('wheel', this.onScrollPDF.bind(this));
  }

  setPdfWidth = (initialWidth) => {
    let width = initialWidth ? initialWidth : this.props.windowWidth;
    if (width > 767) {
      if (this.PDFWidth !== 700) {
        this.toggleLoading(true);
        this.PDFWidth = 700;
        this.state.mobileView && this.toggleMobileView(false);
        this.toggleLoading(false);
      }
    } else if (width <= 767 && width > 415) {
      if (this.PDFWidth !== 400) {
        this.toggleLoading(true);
        this.PDFWidth = 400;
        this.state.mobileView && this.toggleMobileView(false);
        this.toggleLoading(false);
      }
    } else if (width <= 415) {
      if (this.PDFWidth !== 320) {
        this.toggleLoading(true);
        this.toggleMobileView(true);
        this.PDFWidth = 320;
        this.toggleLoading(false);
      }
    }
  };

  toggleLoading = (state) => {
    this.setState({
      loading: typeof state === "boolean" ? state : !this.state.loading,
    });
  };

  toggleMobileView = (state) => {
    this.setState({ mobileView: state });
  };

  onDocumentLoadSuccess(nPages) {
    if (this.state.pageIndex == null) {
      this.setState({
        numPages: nPages,
        pageIndex: 0,
        numPagesRendered: nPages >= 10 ? 10 : nPages,
      });
    } else if (this.state.pageIndex > nPages) {
      this.setState({
        numPages: nPages,
        pageIndex: nPages - 1,
      });
    } else {
      this.setState({
        numPages: nPages,
      });
    }
  }

  onScrollPDF(event) {
    let delta = null;
    if (event.wheelDelta) {
      delta = event.wheelDelta;
    } else {
      delta = -1 * event.deltaY;
    }
    //  This is where some customization can happen
    if (delta < -20) {
      this.nextPage();
    } else if (delta > 10) {
      this.previousPage();
    }
  }

  previousPage = () => {
    if (this.state.pageIndex > 0) {
      this.setState({
        pageIndex: this.state.pageIndex - 1,
      });
    }
  };

  nextPage = () => {
    if (this.state.pageIndex + 1 < this.state.numPages) {
      this.setState({
        pageIndex: this.state.pageIndex + 1,
      });
    }
  };

  renderSinglePage = () => {
    return (
      <Fragment>
        <Page
          key={`page_${this.state.pageIndex + 1}`}
          width={this.PDFWidth}
          pageNumber={this.state.pageIndex + 1}
          className="pdfPage"
          renderMode="canvas"
        />
        <FakePage
          pages={Math.min(this.state.numPages, this.state.pageIndex + 20)}
          width={this.PDFWidth}
        />
      </Fragment>
    );
  };

  renderMorePages = (e) => {
    e && e.stopPropagation();
    const { numPagesRendered, numPages } = this.state;
    let pagesLeft = numPages - numPagesRendered;
    let addPages = pagesLeft - 10 >= 10 ? 10 : pagesLeft;
    this.setState({
      numPagesRendered: this.state.numPagesRendered + addPages,
    });
  };

  renderPages = () => {
    const { numPagesRendered, numPages } = this.state;
    let pages = [];
    for (let i = 0; i <= numPagesRendered && i < numPages; i++) {
      pages.push(
        <Page
          key={`page_${i + 1}`}
          width={this.PDFWidth}
          pageNumber={i + 1}
          className="pdfPage"
          renderMode="canvas"
        />
      );
    }
    return pages;
  };

  renderButton = () => {
    const { numPagesRendered, numPages } = this.state;
    let pagesLeft = numPages - numPagesRendered;
    let addPages = pagesLeft - 10 >= 10 ? 10 : pagesLeft;
    if (numPagesRendered < numPages) {
      return (
        <div
          className={css(styles.loadMoreButton)}
          onClick={this.renderMorePages}
        >
          Load {addPages} More
        </div>
      );
    }
  };

  renderMobileView = () => {
    return (
      <Fragment>
        <Page
          key={`page_${this.state.pageIndex + 1}`}
          width={this.PDFWidth}
          pageNumber={this.state.pageIndex + 1}
          className="pdfPage"
          renderMode="canvas"
        />
        <FakePage
          pages={Math.min(this.state.numPages, this.state.pageIndex + 20)}
          width={this.PDFWidth}
        />
      </Fragment>
    );
  };

  renderDesktopView = () => {
    return (
      <Fragment>
        {this.renderPages()}
        {this.renderButton()}
      </Fragment>
    );
  };

  render() {
    let PDFContainerHeight = this.state.mobileView ? 400 : "100%";

    return (
      <div
        id="pdfContainer"
        style={{
          width: this.PDFWidth,
          height: PDFContainerHeight,
          overflow: "hidden",
          overscrollBehavior: "contain",
          paddingTop: 10,
        }}
      >
        <Document
          file={this.props.file}
          onLoadSuccess={(pdf) => {
            this.onDocumentLoadSuccess(pdf.numPages);
          }}
          className={css(styles.pdfPreview)}
          rotate={0}
        >
          {this.state.loading ? (
            <div className={css(styles.loader)}>
              <Loader loading={true} size={25} />
            </div>
          ) : this.state.mobileView ? (
            this.renderMobileView()
          ) : (
            this.renderDesktopView()
          )}
          {this.state.mobileView && (
            <div className={css(styles.navigation)}>
              <div
                className={css(styles.navigationButton)}
                onClick={this.previousPage}
              >
                <i className="far fa-angle-left" />
              </div>
              <div
                className={css(styles.navigationButton)}
                onClick={this.nextPage}
              >
                <i className="far fa-angle-right" />
              </div>
            </div>
          )}
        </Document>
      </div>
    );
  }
}

class FakePage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ display: "none" }}>
        {Array.from(new Array(this.props.pages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            width={this.props.width}
            className="pdfPage"
            renderMode="svg"
            pageNumber={index + 1}
          />
        ))}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  loadMoreButton: {
    cursor: "pointer",
    color: colors.BLUE(),
    fontSize: 14,
  },
  desktopView: {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "center",
    overflow: "auto",
  },
  pdfPreview: {
    position: "relative",
  },
  navigation: {
    position: "absolute",
    width: "100%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navigationButton: {
    fontSize: 18,
  },
});
