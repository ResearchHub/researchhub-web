import { css, StyleSheet } from "aphrodite";
import { Fragment, useEffect, useState } from "react";
import Grass from "./lottie_json/grass-animation.json";
import JoyRide from "./lottie_json/joy-ride-animation.json";
import Lottie from "react-lottie";
import { Wave } from "react-animated-text";
import colors from "~/config/themes/colors";

const defaultLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: JoyRide,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const FOUR_SEC = 4000;
const TWENTY_SEC = 20000;

const timeLoop = ({
  loadIndex,
  setLoadIndex,
  time,
}: {
  loadIndex: number;
  setLoadIndex: (ind: number) => void;
  time: number;
}) => {
  setTimeout((): void => {
    const nextloadIndex = loadIndex === 0 ? 1 : 0;
    setLoadIndex(nextloadIndex);
    timeLoop({ loadIndex: nextloadIndex, setLoadIndex, time });
  }, time);
};

export default function PaperUploadWizardStandbyBody() {
  const [loadIndex, setLoadIndex] = useState<number>(0);
  const [askRedirect, setAskRedirect] = useState<boolean>(false);

  // TODO: calvinhlee - look at the new socket for success / error
  useEffect(() => {
    timeLoop({
      loadIndex,
      setLoadIndex,
      time: FOUR_SEC,
    });
    setTimeout((): void => setAskRedirect(true), TWENTY_SEC);
  }, []);

  return (
    <div className={css(styles.wizardStandby)}>
      <Lottie
        options={{
          ...defaultLottieOptions,
          animationData: loadIndex === 0 ? JoyRide : Grass,
        }}
        height={320}
        width={320}
      />
      <div className={css(styles.loadText)}>
        {!askRedirect ? (
          <Wave
            delay={30}
            duration={200}
            hoverable
            text={
              loadIndex === 0
                ? "Importing from source..."
                : "Please be patient!"
            }
            effectChange={0.2}
          />
        ) : (
          <Fragment>
            <div>{"It's taking longer than expected :/"}</div>
            <div>{"Feel free to checkout other pages."}</div>
            <div>{"We will let you know when we finish importing!"}</div>
          </Fragment>
        )}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  wizardStandby: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  loadText: {
    marginTop: 32,
    fontSize: 24,
    color: colors.PASTEL_GREEN_TEXT,
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
});
