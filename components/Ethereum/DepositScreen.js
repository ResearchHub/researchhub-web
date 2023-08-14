import { useEffect, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { contractABI, stagingContractABI } from "./contractAbi";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWalletClient,
  useSwitchNetwork,
  useNetwork,
  useContractRead,
  useAccount,
  // eslint-disable-next-line
} from "wagmi";
import { goerli, mainnet } from "wagmi/chains";

// Component
import Button from "~/components/Form/Button";
import ETHAddressInput from "./ETHAddressInput";
import { AmountInput } from "../Form/RSCForm";
import Loader from "../Loader/Loader";

import API from "~/config/api";
import { Helpers } from "~/config/api/index";
import { captureEvent } from "~/config/utils/events";

const isProduction = process.env.REACT_APP_ENV === "production";

const CHAIN_ID = isProduction ? mainnet.id : goerli.id;

// Constants
const RSCContractAddress = isProduction
  ? "0xd101dcc414f310268c37eeb4cd376ccfa507f571"
  : "0x7D7b31439eFe004eDC1c5632222f818369aADdEE";

const HOTWALLET = isProduction
  ? "0x76835CA5Ebc7935CedBB1e0AA3d322e704b1b7B1"
  : "0xc49b1eC975b687259750D9da7BfCC82eEaA2eF19";

const CONTRACT_ABI = isProduction ? contractABI : stagingContractABI;
export function DepositScreen(props) {
  const { ethAccount, buttonEnabled, ethAddressOnChange, openWeb3ReactModal } =
    props;
  const ethersRef = useRef();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [amount, setAmount] = useState(0);
  const { data: signer } = useWalletClient({ chainId: CHAIN_ID });

  const { config } = usePrepareContractWrite({
    address: RSCContractAddress,
    abi: CONTRACT_ABI,
    functionName: "transfer",
    args: [
      HOTWALLET,
      amount && ethersRef.current
        ? ethersRef.current.utils.parseEther(amount)._hex
        : 0,
    ],
  });

  const { data, write } = useContractWrite(config);
  const [balance, setBalance] = useState(0);

  const {
    data: RSCBalance,
    isError,
    isLoading: isLoadingBalance,
  } = useContractRead({
    address: RSCContractAddress,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  useEffect(() => {
    if (RSCBalance) {
      const ethers = require("ethers").ethers;
      setBalance(ethers.utils.formatUnits(RSCBalance, 18));
      ethersRef.current = ethers;
    }
  }, [RSCBalance]);

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    if (data?.hash) {
      const PAYLOAD = {
        amount,
        transaction_hash: data.hash,
        from_address: address,
      };

      fetch(API.TRANSFER, API.POST_CONFIG(PAYLOAD))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          props.onSuccess && props.onSuccess(data.hash);
        })
        .catch((error) => {
          captureEvent({
            error,
            msg: "Deposit backend error",
            data: {
              ...PAYLOAD,
            },
          });
          props.onSuccess && props.onSuccess(data.hash);
        });
    }
  }, [data]);

  const signTransaction = async (e) => {
    e && e.preventDefault();

    if (!signer) {
      openWeb3ReactModal();
      return;
    }

    if (chain.id !== CHAIN_ID) {
      switchNetwork(CHAIN_ID);
    }

    write?.();
  };

  return (
    <form className={css(styles.form)} onSubmit={signTransaction}>
      <div key="deposit-eth-address">
        <ETHAddressInput
          label="From"
          tooltip="The address of your ETH Account (ex. 0x0000...)"
          value={address}
          onChange={ethAddressOnChange}
          ethAccount={address}
          ethAccountIsValid={isConnected}
          containerStyles={styles.ethAddressStyles}
          placeholder={"         Connect your Wallet"}
          icon={
            <img
              src={"/static/eth-diamond-black.png"}
              className={css(styles.metaMaskIcon)}
            />
          }
          onClick={() => {
            openWeb3ReactModal();
          }}
          {...props}
        />
      </div>
      <AmountInput
        minValue={0}
        maxValue={balance}
        balance={
          isLoadingBalance ? <Loader loading={true} size={10} /> : balance
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
          disabled={!ethAccount}
          label={!RSCBalance ? "Connect Your Wallet" : "Confirm"}
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
