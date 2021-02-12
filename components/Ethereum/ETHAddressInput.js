import React from "react";
import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";

// Component
import FormInput from "~/components/Form/FormInput";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ETHAddressInput = (props) => {
  const {
    ethAccount,
    connectedWalletLink,
    connectedMetaMask,
    ethAccountIsValid,
    placeholder,
    icon,
    onClick,
  } = props;

  const renderConnectionStatus = () => {
    if (ethAccount && !ethAccountIsValid) {
      return (
        <div className={css(styles.connectStatus)}>
          <div className={css(styles.dot, styles.invalidAddress)} />
          <span className={css(styles.red)}>Invalid address</span>
        </div>
      );
    }

    if (!connectedMetaMask && ethAccountIsValid) {
      return (
        <div className={css(styles.connectStatus)}>
          <div className={css(styles.dot, styles.connected)} />
          <span className={css(styles.green)}>Valid Address</span>
        </div>
      );
    }

    if (connectedWalletLink) {
      return (
        <div className={css(styles.connectStatus)}>
          <div
            className={css(styles.dot, connectedWalletLink && styles.connected)}
          />
          <span className={css(styles.green)}>Connected: WalletLink</span>
        </div>
      );
    }

    if (connectedMetaMask) {
      return (
        <div className={css(styles.connectStatus)}>
          <div
            className={css(styles.dot, connectedMetaMask && styles.connected)}
          />
          <span className={css(styles.green)}>Connected:</span>
          <img
            src={"/static/icons/metamask.svg"}
            className={css(styles.metaMaskIcon)}
          />
        </div>
      );
    }

    return <div className={css(styles.connectStatus)} />;
  };

  return (
    <div
      className={css(
        styles.root,
        props.containerStyles && props.containerStyles
      )}
    >
      <div className={css(styles.labelRow)}>
        <div
          className={css(styles.label, props.labelStyles && props.labelStyles)}
        >
          {props.label}
          <span className={css(styles.infoIcon)} data-tip={props.tooltip}>
            {icons["info-circle"]}
            <ReactTooltip />
          </span>
        </div>
      </div>
      {!props.value && (
        <span className={css(styles.placeholderIcon)}>
          {icon ? icon : icons.wallet}
        </span>
      )}
      <FormInput
        required={true}
        value={props.value}
        containerStyle={onClick ? styles.formInputClick : styles.formInput}
        onChange={props.onChange && props.onChange}
        placeholder={
          placeholder ? placeholder : "         Recipient ETH Address"
        }
        onClick={onClick && onClick}
      />
      {renderConnectionStatus()}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    position: "relative",
  },
  labelRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    color: "#82817D",
    height: 40,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      height: 70,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    lineSpacing: 1.2,
    color: colors.BLACK(),
    width: "max-content",
  },
  placeholderIcon: {
    position: "absolute",
    color: colors.BLUE(),
    fontSize: 18,
    height: 32,
    width: 32,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    border: `1px solid rgb(232, 232, 242)`,
    top: 38,
    left: 10,
    zIndex: 4,
    cursor: "pointer",
  },
  metaMaskIcon: {
    height: 20,
    marginLeft: 5,
  },
  textLabel: {
    color: colors.BLACK(),
  },
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 500,
    height: 40,
    fontFamily: "Roboto",
  },
  infoIcon: {
    marginLeft: 5,
    cursor: "pointer",
    color: colors.BLACK(0.4),
    color: "#FBFBFD",
  },

  connectStatus: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    // width: "max-content",
    fontSize: 14,
    // test
    width: "100%",
    marginTop: 10,
    height: 15,
  },
  dot: {
    height: 5,
    maxHeight: 5,
    minHeight: 5,
    width: 5,
    maxWidth: 5,
    minWidth: 5,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#f9f4d3",
    border: "2px solid #f8de5a",
  },
  connected: {
    backgroundColor: "#d5f3d7",
    border: "2px solid #7ae9b1",
  },
  invalidAddress: {
    backgroundColor: colors.RED(0.7),
    border: `2px solid ${colors.RED()}`,
  },
  red: {
    color: colors.RED(),
  },
  green: {
    color: colors.GREEN(),
  },
  formInput: {
    width: "100%",
    margin: 0,
    padding: 0,
    minHeight: "unset",
  },
  formInputClick: {
    cursor: "pointer",
    width: "100%",
    margin: 0,
    padding: 0,
    minHeight: "unset",
  },
});

export default ETHAddressInput;
