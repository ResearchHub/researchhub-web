import { Fragment } from "react";
import { StyleSheet } from "aphrodite";
// import { connect } from "react-redux";

// Component
import Head from "~/components/Head";
// import UploadPaperModal from "~/components/Modals/UploadPaperModal";

// Redux
// import { ModalActions } from "~/redux/modals";

class Index extends React.Component {
  componentDidMount() {
    this.props.openUploadPaperModal(true);
  }

  render() {
    return (
      <Fragment>
        <Head title="Upload Paper" description="Upload paper to ResearchHub" />
        <UploadPaperModal />
      </Fragment>
    );
  }
}

var styles = StyleSheet.create({});

// const mapStateToProps = (state) => ({});

// const mapDispatchToProps = {
//   openUploadPaperModal: ModalActions.openUploadPaperModal,
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Index);

export default Index;
