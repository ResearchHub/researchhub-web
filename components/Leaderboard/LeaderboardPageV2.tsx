import { Component, Fragment, ReactElement, useState } from "react";
import { connect } from "react-redux";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import { timeAgo } from "~/config/utils/dates";
import API from "~/config/api";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import Ripples from "react-ripples";
import Router from "next/router";

type ComponentState = {
  items: any[];
  hubId: ID;
  isFetchingLeaderBoard: boolean;
};

type Props = {
  hub: any;
};

export default function LeaderboardPageV2({ hub }: Props): ReactElement<"div"> {
  const sidebar
  return <div></div>;
}
