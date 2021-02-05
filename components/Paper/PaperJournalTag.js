import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import icons from "~/config/themes/icons";
import colors, { bannerColor } from "~/config/themes/colors";
import { getHostFromPath } from "~/config/utils";

const PaperJournalTag = (props) => {
  const { url, externalSource } = props;

  const renderLogo = () => {
    console.log("url", url);
    let source = externalSource ? externalSource : getHostFromPath(url);

    if (source === "org/10") {
      source = "doi";
    }

    if (source === "org/abs/" || source === "org/abs/2003") {
      source = "arxiv";
    }

    // if (source)

    let src = `/static/icons/journals/${source}`;
    console.log("source", source);

    if (source === "googleapis") {
      src += ".webp";
    } else {
      src += ".svg";
    }

    return {
      src,
      className: css(styles.logo, styles[source]),
    };
  };

  const getJournalName = (source) => {
    switch (source) {
    }
  };

  return <img {...renderLogo()} />;
};

const styles = StyleSheet.create({
  logo: {
    height: 15,
    ":hover": {
      opacity: 0.8,
    },
  },
  arxiv: {
    height: 17,
  },
  biorxiv: {
    height: 16,
  },
  nature: {
    height: 12,
  },
  doi: {
    height: 22,
  },
  sciencemag: {
    height: 15,
  },
  googleapis: {
    height: 15,
  },
  mdpi: {
    height: 22,
  },
});

export default PaperJournalTag;
