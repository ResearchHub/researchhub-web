import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import colors from "~/config/themes/colors";
import ProgressBar from "@ramonak/react-progress-bar";

type Props = { onExit: () => void };
const TWENTY_SEC = 20000;

const FAKE_PERCENTS = [2, 7, 11, 13, 24, 28, 32, 50, 55, 63, 70, 81, 83, 85, 88, 89, 91];

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
    const nextloadIndex = loadIndex + 1;
    if (nextloadIndex < FAKE_PERCENTS.length) {
      setLoadIndex(nextloadIndex);
      timeLoop({ loadIndex: nextloadIndex, setLoadIndex, time });
    }
  }, time);
};

export default function PaperUploadWizardStandbyBody({ onExit }: Props) {
  const [loadIndex, setLoadIndex] = useState<number>(0);
  const [askRedirect, setAskRedirect] = useState<boolean>(false);
  const percent = FAKE_PERCENTS[loadIndex];

  // TODO: calvinhlee - look at the new socket for success / error
  useEffect(() => {
    timeLoop({ loadIndex, setLoadIndex, time: 1456 });
    setTimeout((): void => setAskRedirect(true), TWENTY_SEC);
  }, []);

  return (
    <div className={css(styles.wizardStandby)}>
      <div className={css(styles.wizardStandbyBox)}>
        <div className={css(styles.title)}>{"Uploading a paper"}</div>
        <div className={css(styles.statusText)}>
          <div>{"Importing from source ..."}</div>
          <div>{`${percent}%`}</div>
        </div>
        <ProgressBar
          bgColor={colors.GREEN(1)}
          baseBgColor={colors.LIGHT_GREY(1)}
          className={css(styles.progreeBar)}
          completed={percent}
          height="8px"
          customLabel=" "
        />
      </div>

      {askRedirect && (
        <div className={css(styles.loadText)}>
          <div>
            {
              "It's taking longer than expected. We'll send you a notification when the process is finished"
            }
          </div>
          <div
            style={{ color: colors.BLUE(1), cursor: "pointer" }}
            onClick={onExit}
          >
            {"exit"}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  wizardStandby: { marginTop: 32, width: "100%" },
  wizardStandbyBox: {
    backgroundColor: colors.LIGHTER_GREY(0.5),
    borderRadius: 3,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: 142,
    padding: "16px 32px",
    width: "100%",
    marginBottom: 16,
  },
  loadText: {
    color: colors.TEXT_DARKER_GREY,
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
  },
  progreeBar: { width: "100%" },
  title: {
    fontSize: 24,
    fontWeight: 500,
    paddingBottom: 8,
    marginBottom: 16,
    borderBottom: `1px solid ${colors.LIGHT_GREY(1)}`,
  },
  statusText: {
    color: colors.TEXT_DARKER_GREY,
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
  },
});
