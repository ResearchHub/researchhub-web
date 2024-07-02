import { toast } from "react-toastify";

const showToast = ({ content, options = {} }) => {

  if (options["toastId"] && toast.isActive(options["toastId"])) {
    return;
  }

  toast(content, {
    // Defaults
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    ...options, // Custom options
  });
};

export default showToast;
