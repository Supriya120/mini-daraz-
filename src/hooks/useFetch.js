import { useState, useEffect, useCallback } from "react";

// Runs an async function and tracks data / loading / error.
// `deps` tells it when to fetch again (like the useEffect dependency array).
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false; // avoids setting state for an outdated request
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => !ignore && setData(result))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, loading, error, retry };
}
