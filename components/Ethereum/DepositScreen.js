import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import miniToken from "~/components/Modals/Artifacts/mini-me-token";
import contractAbi from "~/components/Modals/Artifacts/contract-abi";
import { contractABI } from "./contractAbi";
import { ethers } from "ethers";
import * as Sentry from "@sentry/browser";

// Component
// import BaseModal from "./BaseModal";
// import Loader from "~/components/Loader/Loader";
// import Button from "~/components/Form/Button";
// import FormInput from "~/components/Form/FormInput";
import { AmountInput, RecipientInput } from "../Form/RSCForm";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useMetaMask, useWalletLink } from "../connectEthereum";
import { sendAmpEvent } from "~/config/fetch";
import {
  sanitizeNumber,
  formatBalance,
  onKeyDownNumInput,
  onPasteNumInput,
  isAddress,
  toCheckSumAddress,
} from "~/config/utils";

// Constants
// const RinkebyRSCContractAddress = "0xD101dCC414F310268c37eEb4cD376CcFA507F571";
const RinkebyRSCContractAddress = "0x2275736dfEf93a811Bb32156724C1FCF6FFd41be";
const RinkebyAppPurchaseContractAddress =
  "0x9483992e2b67fd45683d9147b63734c7a9a7eb82";

class DepositScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      balance: 0, // user wallet balance
      AppPurchaseContractAddress: RinkebyAppPurchaseContractAddress,
      RSCContractAddress: RinkebyRSCContractAddress,
    };

    // Contract Constants
    this.RSCContract;
  }

  componentDidUpdate(prevProps) {
    if (this.props.depositScreen || this.props.ethAccount) {
      this.createContract();
    }
  }

  onChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  onClick = () => {
    if (!this.RSCContract) {
      this.createContract();
    }
  };

  createContract = async () => {
    if (
      this.RSCContract ||
      !this.props.ethAccount ||
      !this.props.ethAccountIsValid
    )
      return;

    let address = RinkebyRSCContractAddress;
    this.RSCContract = new ethers.Contract(
      address,
      contractABI,
      this.props.provider
    );

    this.checkRSCBalance(this.RSCContract);
  };

  checkRSCBalance = async (contract) => {
    const bigNumberBalance = await contract.balanceOf(this.props.ethAccount);
    const balance = ethers.utils.formatUnits(bigNumberBalance, 18);
    this.setState({ balance });
  };

  render() {
    return (
      <div className={css(styles.root)}>
        <AmountInput
          minValue={0}
          maxValue={this.state.balance}
          balance={this.state.balance}
          value={this.state.amount}
          onChange={this.onChange}
          containerStyles={styles.amountInputStyles}
          inputContainerStyles={styles.fullWidth}
          inputStyles={[styles.fullWidth]}
          rightAlignBalance={true}
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  amountInputStyles: {
    width: "100%",
    paddingBottom: 20,
  },
  fullWidth: {
    width: "100%",
    fontSize: 16,
    fontWeight: 400,
  },
});

export default DepositScreen;
