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
  const [hidden, setHidden] = useState(false);

  const renderLogo = () => {
    const source = getJournalName(
      externalSource ? externalSource : getHostFromPath(url)
    );
    const src = getLogoPath(source);

    const imgProps = {
      src,
      className: css(styles.logo, styles[source], hidden && styles.hidden),
      onError: () => setHidden(true),
    };

    return source ? <img {...imgProps} /> : props.onFallback();
  };

  const getJournalName = (source) => {
    switch (source) {
      case "doi":
      case "org/10":
        // return "doi";
        return null;
      case "org/abs/":
      case "org/abs/2003":
      case "org/ftp/arxiv/papers/2101/2101":
      case "org/abs/2101":
        return "arxiv";
      case "Future Science Ltd":
        return "futurescience";
      case "Wiley":
        return "wiley";
      case "Oxford University Press":
      case "Oxford University Press (OUP)":
        return "oup";
      case "Microbiology Society":
        return "mbs";
      case "International Association for Food Protection":
        return "iafp";
      case "Springer Science and Business Media LLC":
        return "springer";
      case "Georg Thieme Verlag KG":
        return "thieme";
      case "Frontiers Media SA":
      case "frontiersin":
        return "frontiers";
      case "Semantic_scholar":
        return "semanticscholar";
      case "Manubot":
        return "manubot";
      case "MDPI AG":
        return "mdpi";
      case "Informa UK Limited":
        return "informa";
      case "EMBO":
        return "embo";
      case "SAGE Publications":
        return "sage";
      default:
        return source;
    }
  };

  const getLogoPath = (source) => {
    const src = `/static/icons/journals/${source}`;
    switch (source) {
      case "googleapis":
      case "informa":
        return src + ".webp";
      case "biomedcentral":
      case "sage":
      case "sciencedirect":
        return src + ".png";
      default:
        return src + ".svg";
    }
  };

  return renderLogo();
};

const styles = StyleSheet.create({
  logo: {
    height: 15,
    opacity: 1,
    ":hover": {
      opacity: 0.8,
    },
    "@media only screen and (max-width: 767px)": {
      marginTop: 10,
    },
  },
  hidden: {
    display: "none",
  },
  arxiv: {
    height: 17,
  },
  biorxiv: {
    height: 16,
  },
  medrxiv: {
    height: 14,
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
    height: 24,
  },
  futurescience: {
    height: 18,
  },
  wiley: {
    height: 10,
  },
  oup: {
    height: 16,
  },
  mbs: {
    height: 22,
  },
  iafp: {
    height: 20,
  },
  springer: {
    height: 19,
  },
  thieme: {
    height: 22,
  },
  frontiers: {
    height: 19,
  },
  semanticscholar: {
    height: 22,
  },
  manubot: {
    height: 20,
  },
  biomedcentral: {
    height: 13,
  },
  pnas: {
    height: 13,
  },
  informa: {
    height: 20,
  },
  embo: {
    height: 20,
  },
  sage: {
    height: 20,
  },
  sciencedirect: {
    height: 50,
  },
});

export default PaperJournalTag;
