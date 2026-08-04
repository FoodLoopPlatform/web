"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { useFieldContext } from "./context";

export interface FieldSelectProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
}

export function FieldSelect({
  id: idProp,
  name,
  value = "",
  onChange,
  className,
  children,
  disabled = false,
  invalid: invalidProp,
}: FieldSelectProps) {
  const fieldContext = useFieldContext();
  const id = idProp || fieldContext?.id;
  const invalid = invalidProp ?? fieldContext?.invalid;
  const describedBy = fieldContext?.describedBy;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract options from children
  const options: { value: string; label: string; disabled?: boolean }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      const props = child.props as {
        value?: string;
        children?: React.ReactNode;
        disabled?: boolean;
      };
      options.push({
        value: String(props.value ?? ""),
        label: String(props.children ?? ""),
        disabled: props.disabled,
      });
    }
  });

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (val: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    if (onChange) {
      onChange({ target: { value: val, name } });
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full font-sans select-none">
      <button
        type="button"
        id={id}
        aria-describedby={describedBy}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "h-11 w-full flex items-center justify-between rounded-xl border bg-surface-container-lowest ps-4 pe-4 text-body-md text-on-surface outline-none transition-all cursor-pointer",
          isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : invalid
              ? "border-error focus-visible:border-error focus-visible:ring-error/20"
              : "border-outline-variant hover:border-primary/60",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption && selectedOption.value !== ""
              ? "text-on-surface font-medium"
              : "text-on-surface-variant/70",
          )}
        >
          {selectedOption ? selectedOption.label : "اختر..."}
        </span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 text-on-surface-variant shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1.5 w-full bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value, opt.disabled)}
                className={cn(
                  "px-4 py-2.5 text-body-md flex items-center justify-between transition-colors",
                  opt.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:bg-light-green active:bg-primary-fixed/40",
                  isSelected
                    ? "bg-primary-fixed text-primary font-bold"
                    : "text-on-surface",
                )}
              >
                <span className="truncate">{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
