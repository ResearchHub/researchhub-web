import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { withAlert } from "react-alert";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import { AmountInput, RecipientInput } from "../Form/RSCForm";
import FormSelect from "../Form/FormSelect";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { setSectionBounty } from "../../config/fetch";
import colors from "../../config/themes/colors";
import { sanitizeNumber } from "~/config/utils";
