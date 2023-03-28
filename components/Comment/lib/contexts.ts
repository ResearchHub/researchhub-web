import { createContext } from 'react';
import { filterOpts, sortOpts } from "./options";

type FeedStateContext = {
  sort: string|null;
  filter: string|null;
}

export const FeedStateContext = createContext<FeedStateContext>({
  sort: sortOpts[0].value,
  filter: filterOpts[0].value,
});