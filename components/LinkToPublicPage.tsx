import Link from "next/link";
import IconButton from "./Icons/IconButton";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRight } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const LinkToPublicPage = ({ type, id, target, slug }) => {
  let basePath = type;
  if (type.toLowerCase() === "preregistration") {
    basePath = "post";
  }
  return (
    <Link
      href={`/${basePath}/${id}/${slug}`}
      data-tip={"View public page"}
      target={target}
      data-for="download-tooltip"
    >
      <IconButton overrideStyle={styles.publicBtn}>
        <Image
          src="/static/ResearchHubText.png"
          width={104}
          height={12}
          alt="ResearchHub"
        />
        <FontAwesomeIcon
          icon={faArrowUpRight}
          style={{ fontSize: 16, marginRight: 4 }}
        />
      </IconButton>
    </Link>
  );
};

const styles = StyleSheet.create({
  publicBtn: {
    color: colors.MEDIUM_GREY(),
    border: "none",
    boxSizing: "border-box",
    padding: "6px 12px",
  },
});

export default LinkToPublicPage;
