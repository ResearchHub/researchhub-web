import { useState } from "react";

// useState hook wrapper that enables only partial updates of the state
export function usePartialState<T>(
  defaultState: T
): [T, (state: Partial<T>) => void] {
  const [state, setFullState] = useState<T>(defaultState);
  const setState = (partialState: Partial<T>) => {
    setFullState({
      ...state,
      ...partialState,
    });
  };
  return [state, setState];
}
