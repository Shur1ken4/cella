"use client";

import { useId, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropProps = {
  onFiles: (files: File[]) => void;
  label: ReactNode;
  hint?: ReactNode;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
};

/**
 * Drop zone that also works from the keyboard (it is a <label> for a file input).
 * Files are handed to the caller — nothing is uploaded.
 */
export function FileDrop({
  onFiles,
  label,
  hint,
  multiple = false,
  accept,
  disabled = false,
  compact = false,
  className,
}: FileDropProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  const take = (list: FileList | null) => {
    const files = list ? Array.from(list) : [];
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) take(e.dataTransfer.files);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md border border-dashed transition-colors duration-150 ease-brand focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan",
        compact ? "px-3 py-2" : "flex-col justify-center px-6 py-8 text-center",
        dragging ? "border-cyan bg-cyan-tint" : "border-border-strong bg-bg hover:border-cyan/60 hover:bg-surface-1",
        disabled && "cursor-not-allowed opacity-45",
        className
      )}
    >
      <Upload className={cn("shrink-0", compact ? "size-4" : "size-6", dragging ? "text-cyan" : "text-text-faint")} aria-hidden="true" />
      <span className={cn("flex flex-col", compact ? "items-start text-left" : "items-center")}>
        <span className="text-sm font-medium text-text">{label}</span>
        {hint && <span className="type-caption text-text-muted">{hint}</span>}
      </span>
      <input
        id={id}
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}
