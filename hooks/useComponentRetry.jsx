const { useState, useCallback } = require("react");

//when a button id clicked, it retry a component
export default function useComponentRetry (onRetry){
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onRetry();
    setIsRetrying(false);
  }, [onRetry]);

  return { isRetrying, retry };
};