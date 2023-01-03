import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loader from "~/components/Loader/Loader";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Login from "~/components/Login/Login";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

type status = "FETCHING" | "VERIFIED" | "ERROR";

function Page(props) {
  const router = useRouter();
  const [status, setStatus] = useState<status>("FETCHING");

  const verifyEmailApi = async () => {
    return fetch(API.VERIFY_EMAIL(), API.POST_CONFIG({ key: router.query.id }))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data:any) => {
        setStatus("VERIFIED")
      })
      .catch(() => {
        setStatus("ERROR")
      })
  };

  useEffect(() => {
    verifyEmailApi();
  }, []);

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.main)}>
        {status === "FETCHING" ? (
          <>
            <Loader size={48} color={colors.NEW_BLUE()} />
            <span className={css(styles.stepTitle)}>Verifying...</span>
          </>
        ) : status === "VERIFIED" ? (
          <>
            <span style={{ color: colors.GREEN(), fontSize: 48 }}>{icons.checkCircleSolid}</span>
            <span className={css(styles.stepTitle,)} style={{color: colors.GREEN()}}>Email verified.</span>
            <Login><span className={css(styles.link)}>Login to ResearchHub</span></Login>
          </>
        ) : status === "ERROR" ? (
          <>
            <span style={{ color: colors.ORANGE_DARK(), fontSize: 48 }}>{icons.exclamationCircle}</span>
            <span className={css(styles.stepTitle,)} style={{color: colors.ORANGE_DARK()}}>Link expired or email already verified.</span>
            <Login><span className={css(styles.link)}>Login to ResearchHub</span></Login>
          </>
        ) : null}

      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 26,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 80,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      marginTop: 50,
    }
  },
  link: {
    color: colors.NEW_BLUE(),
    textDecoration: "underline",
    fontSize: 16,
    cursor: "pointer"
  },
  main: {
    borderRadius: "5px",
    width: 460,
    height: 400,
    padding: 25,
    textAlign: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "25px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "100%",
    }
  }
});

export default Page;
