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
import { sepolia, mainnet, base, baseSepolia } from "wagmi/chains";

// Component
import Button from "~/components/Form/Button";
import ETHAddressInput from "./ETHAddressInput";
import { AmountInput } from "../Form/RSCForm";
import Loader from "../Loader/Loader";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";

const isProduction = process.env.REACT_APP_ENV === "production";

const CHAIN_IDS = isProduction
  ? [mainnet.id, base.id]
  : [sepolia.id, baseSepolia.id];

// Constants
const RSCContractAddress = {
  [mainnet.id]: "0xd101dcc414f310268c37eeb4cd376ccfa507f571",
  [base.id]: "0xfbb75a59193a3525a8825bebe7d4b56899e2f7e1",
  [sepolia.id]: "0xEe8D932a66aDA39E4EF08046734F601D04B6a3DA",
  [baseSepolia.id]: "0xdAf43508D785939D6C2d97c2df73d65c9359dBEa",
};

const HOTWALLET = {
  [mainnet.id]: "0x7F57d306a9422ee8175aDc25898B1b2EBF1010cb",
  [base.id]: "0x7F57d306a9422ee8175aDc25898B1b2EBF1010cb",
  [sepolia.id]: "0xA8ebEc7ec4BDd36b603C1Bb46C92B8Cc93616e8F",
  [baseSepolia.id]: "0xA8ebEc7ec4BDd36b603C1Bb46C92B8Cc93616e8F",
};

const CONTRACT_ABI = isProduction ? contractABI : stagingContractABI;
export function DepositScreen(props) {
  const { ethAccount, buttonEnabled, ethAddressOnChange, openWeb3ReactModal } =
    props;
  const ethersRef = useRef();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [amount, setAmount] = useState(0);
  const { data: signer } = useWalletClient({ chainId: chain?.id });

  const { config } = usePrepareContractWrite({
    address: RSCContractAddress[chain?.id],
    abi: CONTRACT_ABI,
    functionName: "transfer",
    args: [
      HOTWALLET[chain?.id],
      amount && ethersRef.current
        ? ethersRef.current.utils.parseEther(amount)._hex
        : 0,
    ],
  });

  const { data, write, isError } = useContractWrite({
    ...config,
    onError: (error) => {
      setIsTransacting(false);
      captureEvent({
        error,
        msg: "Deposit transaction rejected",
        data: {
          amount,
          from_address: address,
        },
      });
    },
  });
  const [balance, setBalance] = useState(0);

  const { data: RSCBalance, isError: isLoadingBalance } = useContractRead({
    address: RSCContractAddress[chain?.id],
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

  // Initialize ethers earlier to avoid race conditions
  useEffect(() => {
    const ethers = require("ethers").ethers;
    ethersRef.current = ethers;
  }, []);

  // Add error state
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const value = e.target.value;
    // Validate amount
    if (value && (!Number(value) || Number(value) <= 0)) {
      setError("Please enter a valid amount");
    } else if (value && Number(value) > Number(balance)) {
      setError("Amount exceeds balance");
    } else {
      setError(null);
    }
    setAmount(value);
  };

  const [isTransacting, setIsTransacting] = useState(false);

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case mainnet.id:
        return "ETHEREUM";
      case sepolia.id:
        return "ETHEREUM";
      case base.id:
        return "BASE";
      case baseSepolia.id:
        return "BASE";
      default:
        return "unknown";
    }
  };

  useEffect(() => {
    if (data?.hash) {
      setIsTransacting(false);
      const PAYLOAD = {
        amount,
        transaction_hash: data.hash,
        from_address: address,
        network: getNetworkName(chain?.id),
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

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsTransacting(true);

    if (!signer) {
      setIsTransacting(false);
      openWeb3ReactModal();
      return;
    }

    if (!CHAIN_IDS.includes(chain?.id)) {
      setIsTransacting(false);
      switchNetwork(CHAIN_IDS[0]);
      return;
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
        error={error || (isError ? "Transaction failed" : null)}
      />
      <div className={css(styles.buttonContainer)}>
        <Button
          disabled={!ethAccount || isTransacting}
          label={
            !RSCBalance
              ? "Connect Your Wallet"
              : isTransacting
              ? "Processing..."
              : "Confirm"
          }
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
