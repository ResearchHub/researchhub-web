import { createContext } from "react";
import { filterOpts, sortOpts } from "./options";

type CommentTreeContext = {
  sort: string | null;
  filter: string | null;
  onCreate: Function;
  onUpdate: Function;
  onFetchMore: Function;
};

export const CommentTreeContext = createContext<CommentTreeContext>({
  sort: sortOpts[0].value,
  filter: filterOpts[0].value,
  // These functions are defined in the component the context is used.
  // they will receive their value in there since their definition depends on state.
  onCreate: () => null,
  onUpdate: () => null,
  onFetchMore: () => null,
});
