import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet, css } from "aphrodite";
import showToast from "./showToast";
import {  faLongArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { Organization } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import ResearchHubIcon from "~/static/ResearchHubIcon";
import RHLogo from "~/components/Home/RHLogo";

interface Props {
    content: any
//   url: string;
//   actionLabel?: string;
//   onActionClick?: Function;
}

const showSiteUpdatesToast = ({
  content
}: Props) => {
  showToast({
    content: (
      <div className={css(toastStyles.root)}>
        <div className={css(toastStyles.title)}>
            <RHLogo iconStyle={toastStyles.rhLogoNav} withText={false} height={30} width={30} />
            Updates from the ResearchHub team
        </div>
        <div className={css(toastStyles.body)}>
            {content}
        </div>
        <div className={css(toastStyles.actionWrapper)}>
            <Link target="_blank" href="https://researchhub-web-researchhub.vercel.app/post/278/researchhub-product-updates-051524" className={css(toastStyles.link)}>
                View updates <FontAwesomeIcon icon={faLongArrowRight} />        
            </Link>
        </div>
      </div>
    ),
    options: {
      style: {
        background: "white",
      },
      closeButton: false,
      autoClose: false,
    },
  });
};

const toastStyles = StyleSheet.create({
  actionWrapper: {
    marginRight: 10,
  },
  rhLogoNav: {

  },
  title: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    
  },
  link: {
    textDecoration: "none",
    color: colors.NEW_BLUE(),
    fontSize: 13,
  },
  root: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    // alignItems: "center",
    color: colors.BLACK(),
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
  },
  message: {
    marginRight: 10,
    whiteSpace: "nowrap",
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#605e5e",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
  },
  primaryCTA: {
    border: "none",
    whiteSpace: "nowrap",
    ":hover": {
      background: `rgba(255, 255, 255, 0.15)`,
    },
  },
  viewLabel: {
    fontWeight: 600,
    color: "rgb(110 141 255)",
  },
});

export default showSiteUpdatesToast;
