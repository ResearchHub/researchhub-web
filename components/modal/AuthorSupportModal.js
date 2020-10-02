import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

// Component
import AuthorAvatar from "~/components/AuthorAvatar";
import BaseModal from "./BaseModal";
import FormInput from "~/components/Form/FormInput";
import AvatarUpload from "~/components/AvatarUpload";
import FormTextArea from "~/components/Form/FormTextArea";
import Button from "~/components/Form/Button";
import EducationModal from "./EducationModal";
import EducationSummaryCard from "~/components/Form/EducationSummaryCard";
import Toggle from "react-toggle";
import "~/components/TextEditor/stylesheets/ReactToggle.css";

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const AuthorSupportModal = (props) => {
  return <div className={css(styles.root)}></div>;
};
