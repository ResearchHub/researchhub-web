import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ModalActions } from "~/redux/modals";

type Props = {};

export default function RscBalanceHistory({}: Props): ReactElement {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = getCurrentUser();
  // dispatch(ModalActions.openWithdrawalModal(true));
  // router.push(`/user/${currentUser?.id}/rsc`);

  return <div>HIjkl;jkfld;jskafl;djksla;fjdkls;ajfkdl;sajfkl;dsjak;l</div>;
}
