import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import Image from "next/image";
import Bounty from "~/config/types/bounty";
import colors from "~/config/themes/colors";

type Props = {
  originalBounty?: Bounty
};

function SuccessScreen({
  originalBounty
}: Props): ReactElement {
  return (
    <div className={css(styles.container)}>
      <Image src="/static/icons/success2.png" width={62} height={62} alt={"Bounty successfully created"} />
      <h2 className={css(styles.title)}>
        {originalBounty
          ? `Thank you for your contribution.`
          : `Your Bounty has been started.`
        }
      </h2>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "unset",
    },
  },
  title: {
    marginTop: 24,
    fontSize: 26,
    fontWeight: 500,
  },
  description: {
    lineHeight: "20px",
    marginTop: 16,
  },
  twitter: {
    background: colors.NEW_BLUE(),
    width: 200,
    height: 50,
    color: colors.WHITE(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  twitterText: {
    marginLeft: 7,
    fontWeight: 500,
  },
  link: {
    textDecoration: "none",
  },
  shareRow: {
    display: "flex",
    marginTop: 16,
  },
  copyURLButton: {
    marginTop: 16,
    color: colors.NEW_BLUE(),
    cursor: "pointer",
  },
});

export default SuccessScreen;
