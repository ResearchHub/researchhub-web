import { Fragment, useState } from "react";

export default function PaperUploadWizardStandbyBody() {
  
  const [src, setSrc] = useState("https://giphy.com/embed/xTiN0uzf6bno09mXrG");
  setTimeout(() => setSrc("https://giphy.com/embed/xTiN0yAuTXvtIH3EiI"), 4000);

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
