import { connect } from "react-redux";
import { StyleSheet } from "aphrodite";

// Component

// Config
import HubPage from "../components/Hubs/HubPage";

class Index extends React.Component {
  render() {
    return <HubPage home={true} />;
  }
}

var styles = StyleSheet.create({});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
