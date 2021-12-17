import { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { contractABI } from "./contractAbi";
import { ethers } from "ethers";

// Dynamic modules
import dynamic from "next/dynamic";
const contractAbi = dynamic(() =>
  import("~/components/Modals/Artifacts/contract-abi")
);

// Component
import Button from "~/components/Form/Button";
import ETHAddressInput from "./ETHAddressInput";
import { AmountInput } from "../Form/RSCForm";
import Loader from "../Loader/Loader";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { INFURA_ENDPOINT } from "~/config/constants";

// Constants
const RSCContractAddress =
  process.env.REACT_APP_ENV === "staging" ||
  process.env.NODE_ENV !== "production"
    ? "0x2275736dfEf93a811Bb32156724C1FCF6FFd41be"
    : "0xd101dcc414f310268c37eeb4cd376ccfa507f571";

const HOTWALLET =
  process.env.REACT_APP_ENV === "staging" ||
  process.env.NODE_ENV !== "production"
    ? "0xc49b1eC975b687259750D9da7BfCC82eEaA2eF19"
    : "0x76835CA5Ebc7935CedBB1e0AA3d322e704b1b7B1";
export function DepositScreen(props) {
  const { ethAccount, buttonEnabled, connectMetaMask, ethAddressOnChange } =
    props;

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [RSCContract, setRSCContract] = useState(null);

  useEffect(() => {
    const createContract = () => {
      const address = RSCContractAddress;
      const provider = new ethers.providers.JsonRpcProvider(INFURA_ENDPOINT);
      const contract = new ethers.Contract(address, contractABI, provider);
      setRSCContract(contract);
    };
    createContract();
  }, []);

  useEffect(() => {
    checkRSCBalance();
  }, [RSCContract, ethAccount]);

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  const onClick = () => {
    checkRSCBalance();
  };

  const checkRSCBalance = async () => {
    setFetchingBalance(true);
    if (RSCContract) {
      const bigNumberBalance = await RSCContract.balanceOf(props.ethAccount);
      const balance = ethers.utils.formatUnits(bigNumberBalance, 18);
      setBalance(balance);
    }
    setFetchingBalance(false);
  };

  const signTransaction = async (e) => {
    e && e.preventDefault();
    const address = RSCContractAddress;

    const convertedAmount = ethers.utils.parseEther(amount);
    const signer = props.provider.getSigner(0);
    const contract = new ethers.Contract(address, contractABI, signer);

    const tx = await contract.transfer(HOTWALLET, convertedAmount);

    if (tx) {
      const PAYLOAD = {
        ...tx,
        amount,
        transaction_hash: tx.hash,
        to_address: tx.to,
      };
      props.onSuccess(tx.hash);

      return fetch(API.TRANSFER, API.POST_CONFIG(PAYLOAD))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON);
    }
  };

  return (
    <form className={css(styles.form)} onSubmit={signTransaction}>
      <ETHAddressInput
        label="From"
        tooltip="The address of your ETH Account (ex. 0x0000...)"
        value={ethAccount}
        onChange={ethAddressOnChange}
        containerStyles={styles.ethAddressStyles}
        placeholder={"         Connect MetaMask Wallet"}
        icon={
          <img
            src={"/static/icons/metamask.svg"}
            className={css(styles.metaMaskIcon)}
          />
        }
        onClick={connectMetaMask}
        {...props}
      />
      <AmountInput
        minValue={0}
        maxValue={balance}
        balance={
          fetchingBalance ? <Loader loading={true} size={10} /> : balance
        }
        value={amount}
        onChange={onChange}
        containerStyles={styles.amountInputStyles}
        inputContainerStyles={styles.fullWidth}
        inputStyles={[styles.fullWidth]}
        rightAlignBalance={true}
        required={true}
      />
      <div className={css(styles.buttonContainer)}>
        <Button
          disabled={!buttonEnabled || !ethAccount}
          label={!RSCContract ? <Loader loading={true} size={10} /> : "Confirm"}
          type="submit"
          customButtonStyle={styles.button}
          rippleClass={styles.button}
        />
      </div>
    </form>
  );
}
const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  ethAddressStyles: {
    marginTop: 20,
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
  metaMaskIcon: {
    height: 23,
  },
});

export default DepositScreen;
