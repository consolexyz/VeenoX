import { useCallback, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      setError("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(text);
      setError(null);
      setTimeout(() => setIsCopied(null), 2000);
      return true;
    } catch (err) {
      setError("Failed to copy");
      setIsCopied(null);
      return false;
    }
  }, []);

  return { copyToClipboard, isCopied, error };
};
