import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { GoogleLogin, GoogleLogout } from "react-google-login";

// Component
import Button from "../components/Form/Button";
import HubsList from "~/components/Hubs/HubsList";
import FormSelect from "~/components/Form/FormSelect";
import InfiniteScroll from "react-infinite-scroller";
import PaperEntryCard from "../components/Hubs/PaperEntryCard";
import Loader from "~/components/Loader/Loader";
import GoogleLoginButton from "~/components/GoogleLoginButton";

// Redux
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { UPVOTE_ENUM, DOWNVOTE_ENUM } from "../config/constants";
import HubPage from "../components/Hubs/HubPage";

const filterOptions = [
  {
    value: "top_rated",
    label: "Top Rated",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
  },
];

const filterScope = [
  {
    value: "year",
    label: "This Year",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "day",
    label: "Today",
  },
];

class Index extends React.Component {
  getInitialProps = () => {
    // TODO: GET THE DATA HERE
  };

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
