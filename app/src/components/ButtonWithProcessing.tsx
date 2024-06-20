import LoadingSpinner from "@/components/LoadingSpinner";
import { ReactNode } from "react";
import clsx from "clsx";

export default function ButtonWithProcessing({
  isSending,
  content,
  isSendingContent,
  onClick,
  disabled,
  className,
  error,
}: {
  isSending: boolean;
  content: ReactNode;
  isSendingContent: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  error?: string;
}) {
  return (
    <>
      <button
        className={clsx(
          "rounded-md whitespace-nowrap transition-all flex flex-row gap-2 items-center justify-center disabled:opacity-30",
          className,
        )}
        disabled={isSending || disabled}
        onClick={onClick}
      >
        {isSending ? isSendingContent : content}
        {isSending ? <LoadingSpinner /> : null}
      </button>
      <span className={"text-red-500 italic text-sm"}>{error}</span>
    </>
  );
}
