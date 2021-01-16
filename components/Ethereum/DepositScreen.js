import React from "react";
import { StyleSheet, css } from "aphrodite";
import miniToken from "~/components/Modals/Artifacts/mini-me-token";
import contractAbi from "~/components/Modals/Artifacts/contract-abi";
import { contractABI } from "./contractAbi";
import { ethers } from "ethers";
import * as Sentry from "@sentry/browser";

// Component
import Button from "~/components/Form/Button";
import ETHAddressInput from "./ETHAddressInput";
import { AmountInput } from "../Form/RSCForm";
import Loader from "../Loader/Loader";

// Constants
const RinkebyRSCContractAddress = "0x2275736dfEf93a811Bb32156724C1FCF6FFd41be";

class DepositScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      balance: 0, // user wallet balance
      fetchingBalance: false,
      RSCContractAddress: RinkebyRSCContractAddress,
    };

    // Contract Constants
    this.RSCContract;
  }

  componentDidUpdate(prevProps) {
    if (this.props.depositScreen) {
      if (this.props.ethAccount && this.props.ethAccountIsValid) {
        this.RSCContract ? this.checkRSCBalance() : this.createContract();
      }
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
    const address = RinkebyRSCContractAddress;
    this.RSCContract = new ethers.Contract(
      address,
      contractABI,
      this.props.provider
        ? this.props.provider
        : ethers.getDefaultProvider("rinkeby")
    );
    this.checkRSCBalance();
  };

  checkRSCBalance = (contract = this.RSCContract) => {
    if (!this.state.balance && !this.state.fetchingBalance) {
      this.setState({ fetchingBalance: true }, async () => {
        const bigNumberBalance = await contract.balanceOf(
          this.props.ethAccount
        );
        const balance = ethers.utils.formatUnits(bigNumberBalance, 18);
        this.setState({ balance, fetchingBalance: false });
      });
    }
  };

  signTransaction = async (e) => {
    e && e.preventDefault();
    const address = RinkebyRSCContractAddress;

    const amount = ethers.utils.parseEther(this.state.amount);
    const signer = this.props.provider.getSigner(0);
    const contract = new ethers.Contract(address, contractABI, signer);

    const tx = await contract.transfer(
      "0xFa3959797C08023c69723d58c895C446A3e7eD50",
      amount
    );
  };

  render() {
    const { ethAccount, buttonEnabled, ethAddressOnChange } = this.props;
    return (
      <form className={css(styles.form)} onSubmit={this.signTransaction}>
        <ETHAddressInput
          label="From"
          tooltip="The address of your ETH Account (ex. 0x0000...)"
          value={ethAccount}
          onChange={ethAddressOnChange}
          containerStyles={styles.ethAddressStyles}
          {...this.props}
        />
        <AmountInput
          minValue={0}
          maxValue={this.state.balance}
          balance={
            this.state.fetchingBalance ? (
              <Loader loading={true} size={10} />
            ) : (
              this.state.balance
            )
          }
          value={this.state.amount}
          onChange={this.onChange}
          containerStyles={styles.amountInputStyles}
          inputContainerStyles={styles.fullWidth}
          inputStyles={[styles.fullWidth]}
          rightAlignBalance={true}
          required={true}
        />
        <div className={css(styles.buttonContainer)}>
          <Button
            disabled={!buttonEnabled || !ethAccount}
            label={"Confirm"}
            type="submit"
            customButtonStyle={styles.button}
            rippleClass={styles.button}
          />
        </div>
      </form>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  ethAddressStyles: {
    marginTop: 25,
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
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
    },
  },
});

export default DepositScreen;
