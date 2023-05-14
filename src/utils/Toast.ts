import {toast} from "react-toastify";
import {UpdateOptions} from "react-toastify/dist/types";

export const toast_promise = async <T>(promise: Promise<T> | (() => Promise<T>), errStyles: string | UpdateOptions, pendingStyles: string | UpdateOptions, successStyles: string | UpdateOptions): Promise<T> => {
  return await toast.promise(
    promise,
    {
      pending: pendingStyles,
      success: successStyles,
      error: errStyles,
    },
    {
      style: {
        top: "10px",
        backgroundColor: "#ffffff",
        boxShadow: "4px 4px 10px rgba(162, 156, 199, 0.15)",
        borderRadius: "18px"
      }
    }
  )
}



