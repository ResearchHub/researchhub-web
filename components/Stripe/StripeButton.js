// NPM Modules
import React, { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

import Button from "~/components/Form/Button";
import EmbedModal from "~/components/modal/EmbedModal";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const StripeButton = (props) => {
  const { customButtonStyle, rippleClass } = props;
  const [openModal, toggleOpenModal] = useState(false);
  const [stripeUrl, setStripeUrl] = useState();

  const openStripe = () => {
    return fetch(API.ONBOARD_STRIPE, API.POST_CONFIG({}))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        window.open(
          res.url,
          "_blank",
          "location=yes,height=600,width=500,scrollbars=yes,resizable=yes,status=yes"
        );
      });
  };

  return (
    <div className={css(styles.container)}>
      <EmbedModal
        isOpen={openModal}
        stripeUrl={stripeUrl}
        toggleModal={toggleOpenModal}
      />
      <Button
        label={"Connect Stripe"}
        onClick={openStripe}
        customButtonStyle={customButtonStyle}
        rippleClass={rippleClass}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default StripeButton;
