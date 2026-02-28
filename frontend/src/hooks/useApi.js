import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Generic hook for API calls with loading / error state.
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunc(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Something went wrong";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute };
};

export default useApi;
