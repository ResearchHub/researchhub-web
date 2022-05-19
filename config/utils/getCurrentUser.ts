import { useStore } from "react-redux";

export function getCurrentUser() {
  return useStore()?.getState()?.auth?.user;
}
