import { parseUser, RHUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.auth?.user);
  
  const currentUser = useMemo(() => {
    return isEmpty(user) ? null : parseUser(user);
  }, [user?.id]);

  return currentUser;
};

export default useCurrentUser;