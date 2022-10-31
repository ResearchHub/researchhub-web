import { useState } from "react";
import InviteModal from "./InviteModal";
import { useSelector, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";

type Args = {
  children: any;
  openLoginModal: Function;
  context: "bounty" | "referral";
};

const InviteButton = ({ children, openLoginModal, context }: Args) => {
  const [isOpen, setIsOpen] = useState(false);
  // @ts-ignore
  const auth = useSelector((state) => state.auth);

  return (
    <span>
      <span
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </span>
      <InviteModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        user={auth?.user}
        context={context}
      />
    </span>
  );
};

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(null, mapDispatchToProps)(InviteButton);
