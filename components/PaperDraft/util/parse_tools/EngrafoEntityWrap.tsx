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
  const { className: engrafoClassName } = contentState
    .getEntity(entityKey)
    .getData();
  return <span className={engrafoClassName}>{children}</span>;
}
