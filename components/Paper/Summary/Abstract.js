import { Fragment } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import Link from "next/link";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import ManageBulletPointsModal from "~/components/Modals/ManageBulletPointsModal";
import FormTextArea from "~/components/Form/FormTextArea";
import SummaryContributor from "../SummaryContributor";
import ModeratorQA from "~/components/Moderator/ModeratorQA";
import SectionBounty from "./SectionBounty";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { isQuillDelta } from "~/config/utils/";

import { sendAmpEvent, checkSummaryVote } from "~/config/fetch";
