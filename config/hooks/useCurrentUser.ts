import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector } from "react-redux";

const useCurrentUser = () => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  return currentUser;
};

export default useCurrentUser;
