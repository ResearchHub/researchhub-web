import { toast } from "react-toastify";

const showToast = ({ content, options = {} }) => {
  toast(content, {
    // Defaults
    position: "bottom-right",
    autoClose: 300000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    ...options, // Custom options
  });
};

export default showToast;
