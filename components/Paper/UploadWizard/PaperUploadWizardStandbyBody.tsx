import { Fragment, useEffect, useState } from "react";

const ANIMATION_1 = "https://giphy.com/embed/xTiN0uzf6bno09mXrG";
const ANIMATION_2 = "https://giphy.com/embed/xTiN0yAuTXvtIH3EiI";
const FOUR_SEC = 4000;
const TWENTY_SEC = 20000;

const timeLoop = ({
  src,
  setSrc,
  time,
}: {
  src: string;
  setSrc: (str: string) => void;
  time: number;
}) => {
  setTimeout((): void => {
    const nextSrc = src === ANIMATION_1 ? ANIMATION_2 : ANIMATION_1;
    setSrc(nextSrc);
    timeLoop({ src: nextSrc, setSrc, time });
  }, time);
};

export default function PaperUploadWizardStandbyBody() {
  const [src, setSrc] = useState<string>(ANIMATION_1);
  const [askRedirect, setAskRedirect] = useState<boolean>(false);

  useEffect(() => {
    timeLoop({
      src,
      setSrc,
      time: FOUR_SEC,
    });
    setTimeout((): void => setAskRedirect(true), TWENTY_SEC);
  }, []);

  return (
    <Fragment>
      <iframe
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      />
    </Fragment>
  );
}
