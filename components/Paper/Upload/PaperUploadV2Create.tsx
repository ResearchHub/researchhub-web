import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useEffectFetchSuggestedHubs } from "./api/useEffectGetSuggestedHubs";

export default function PaperuploadV2Create(): ReactElement<typeof Fragment> {
  const [suggestedHubs, setSuggestedHubs] = useState<any>(null);
  useEffectFetchSuggestedHubs({ setSuggestedHubs });

  return <Fragment>Hi this is Create</Fragment>;
}
