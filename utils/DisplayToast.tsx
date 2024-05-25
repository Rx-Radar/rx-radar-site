import { toast, Bounce } from "react-toastify";

// handles showing popup messages
export const showToast = (type: string, msg: string | undefined) => {
    if (type == 'error') {
      toast.error(msg, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    toast(msg, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }