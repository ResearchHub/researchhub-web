import { useState } from "react";
import InviteModal from "./InviteModal";
import { useSelector } from "react-redux";

type Args = {
  children: any;
}

const InviteButton = ({ children }: Args) => {
  const [isOpen, setIsOpen] = useState(false);
  // @ts-ignore
  const user = useSelector((state) => state?.auth?.user);

  return (
    <span onClick={() => setIsOpen(true)}>
      <span>{children}</span>
      <InviteModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        user={user}
      />
    </span>
  )
}

export default InviteButton;
