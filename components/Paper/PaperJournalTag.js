import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import icons from "~/config/themes/icons";
import colors, { bannerColor } from "~/config/themes/colors";
import { getJournalFromURL } from "~/config/utils/parsers";
import {
  capitalize,
  getJournalImagePath,
  formatJournalName,
} from "~/config/utils/misc";

const PaperJournalTag = (props) => {
  const { url, externalSource } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const source = externalSource ? externalSource : getJournalFromURL(url);
  const journal = formatJournalName(source);
  const src = getJournalImagePath(journal);

  useEffect(() => {
    return imgExists(src, (exists) => {
      if (exists && !error) {
        setLoading(false);
        return setError(false);
      } else {
        setLoading(false);
        return setError(true);
      }
    });
  }, [url, externalSource]);

  const imageProps = {
    src,
    className: css(styles.logo, styles[journal], error && styles.error),
    "data-tip": capitalize(source || ""),
  };

  function imgExists(url, callback) {
    setLoading(true);
    var img = new Image();
    img.onload = function() {
      callback(true);
    };
    img.onerror = function() {
      callback(false);
    };
    img.src = url;
  }

  if (loading) {
    return <span></span>;
  }

  if (!journal || error) {
    return props.onFallback(source);
  } else {
    return <img {...imageProps} onError={() => null} />;
  }
};

const styles = StyleSheet.create({
  logo: {
    height: 15,
    maxWidth: 80,
    objectFit: "contain",
    opacity: 1,
    ":hover": {
      opacity: 0.8,
    },
  },
  error: {
    display: "none",
  },
  arxiv: {
    height: 16,
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
    height: 20,
  },
  researchgate: {
    height: 11,
  },
});

export default PaperJournalTag;
