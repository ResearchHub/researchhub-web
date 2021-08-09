import { css, StyleSheet } from "aphrodite";
import { ValueOf } from "../../../../config/types/root_types";
import BaseModal from "../../../Modals/BaseModal";
import React, { ReactElement, useState } from "react";
import { BodyTypeVals } from "./modalBodyTypes";

type Props = {
  onSelectType: (bodyType: BodyTypeVals) => void;
};

export default function AddNewSourceBodyStandBy() {
  return <div></div>;
}
