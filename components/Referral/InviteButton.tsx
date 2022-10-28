import { useState } from "react";
import InviteModal from "./InviteModal";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { ModalActions } from "~/redux/modals";

type Args = {
  children: any;
  openLoginModal: Function;
};

const InviteButton = ({ children, openLoginModal }: Args) => {
  const [isOpen, setIsOpen] = useState(false);
  // @ts-ignore
  const auth = useSelector((state) => state.auth);
  
  return (
    <span>
      <span onClick={() => {
        if (!auth?.user?.id) {
          openLoginModal(true, "Please Sign in with Google to continue.");
        } else {
          setIsOpen(true);
        }
      }}>{children}</span>
      <InviteModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        user={auth?.user}
      />
    </span>
  );
};

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(null, mapDispatchToProps)(InviteButton);
