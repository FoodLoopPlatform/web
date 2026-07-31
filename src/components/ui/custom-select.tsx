"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "اختر من القائمة...",
  disabled = false,
  className = "",
  ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
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

  // Close dropdown on Escape key
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
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full font-sans select-none ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        aria-label={ariaLabel || placeholder}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 bg-surface-container-lowest transition-all cursor-pointer outline-none text-body-md ${
          isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-sm"
            : "border-outline-variant hover:border-primary/60"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`truncate ${
            selectedOption
              ? "text-on-surface font-medium"
              : "text-on-surface-variant/70"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon
          name="expand_more"
          className={`h-5 w-5 text-on-surface-variant shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Floating Options Dropdown Menu */}
      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-1.5 w-full bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
        >
          {options.length > 0 ? (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value, opt.disabled)}
                  className={`px-4 py-2.5 text-body-md flex items-center justify-between transition-colors ${
                    opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:bg-light-green active:bg-primary-fixed/40"
                  } ${
                    isSelected
                      ? "bg-primary-fixed text-primary font-bold"
                      : "text-on-surface"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Icon
                      name="check"
                      className="h-4 w-4 text-primary shrink-0 mr-2"
                    />
                  )}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-3 text-xs text-on-surface-variant/70 text-center">
              لا توجد خيارات متاحة
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
