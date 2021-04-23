import React, { ReactElement } from "react";

export default function EngrafoEntityWrapper({
  /* Props passed down from draft-js. See documentations for decorators */
  blockKey,
  children,
  contentState,
  decoratedText,
  entityKey,
}): ReactElement<"div"> {
  // className comes from htmlToEntity
  console.warn("HI????");
  const { className: engrafoClassName } = contentState
    .getEntity(entityKey)
    .getData();
  return <div className={engrafoClassName}>HJIHIHIHI</div>;
}
