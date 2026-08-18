/* eslint-disable max-lines */
import React from "react";

interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
}

export function Icon({ name, className = "h-5 w-5", fill = false }: IconProps) {
  // Common SVG properties
  const svgProps = {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: fill ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...svgProps}>
          <rect
            x="3"
            y="3"
            width="7"
            height="9"
            rx="1"
            fill={fill ? "currentColor" : "none"}
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="5"
            rx="1"
            fill={fill ? "currentColor" : "none"}
          />
          <rect
            x="14"
            y="12"
            width="7"
            height="9"
            rx="1"
            fill={fill ? "currentColor" : "none"}
          />
          <rect
            x="3"
            y="16"
            width="7"
            height="5"
            rx="1"
            fill={fill ? "currentColor" : "none"}
          />
        </svg>
      );

    case "inventory_2":
      return (
        <svg {...svgProps}>
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" rx="1" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      );

    case "payments":
      return (
        <svg {...svgProps}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="12" cy="14" r="2.5" />
          <path d="M6 14h.01M18 14h.01" />
        </svg>
      );

    case "shopping_cart":
      return (
        <svg {...svgProps}>
          <circle cx="9" cy="21" r="1" fill="currentColor" />
          <circle cx="20" cy="21" r="1" fill="currentColor" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );

    case "local_shipping":
      return (
        <svg {...svgProps}>
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle
            cx="5.5"
            cy="18.5"
            r="2.5"
            fill={fill ? "currentColor" : "none"}
          />
          <circle
            cx="18.5"
            cy="18.5"
            r="2.5"
            fill={fill ? "currentColor" : "none"}
          />
        </svg>
      );

    case "settings":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

    case "contact_support":
    case "help":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );

    case "logout":
      return (
        <svg {...svgProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    case "add":
      return (
        <svg {...svgProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );

    case "add_circle":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );

    case "sell":
      return (
        <svg {...svgProps}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );

    case "warning":
      return (
        <svg {...svgProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );

    case "volunteer_activism":
      return (
        <svg {...svgProps}>
          <path
            d="M12 7c1.3-1.6 3.7-1.6 5 0s1.3 4.2-5 7.5c-6.3-3.3-6.3-5.9-5-7.5s3.7-1.6 5 0z"
            fill={fill ? "currentColor" : "none"}
          />
          <path d="M2 13c3 .5 6-1 8.5-3s5 0 8 2.5c1.5 1.2 2.5 3 2.5 4.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-15c-.8 0-1.6-.3-2.1-.9l-1.9-2.1" />
        </svg>
      );

    case "eco":
      return (
        <svg {...svgProps}>
          <path
            d="M2 22C2 12 10 4 22 2c-2 12-10 20-20 20z"
            fill={fill ? "currentColor" : "none"}
          />
          <path d="M9 13c3.5-3.5 7.5-5 13-7" />
        </svg>
      );

    case "notifications":
      return (
        <svg {...svgProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );

    case "language":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );

    case "trending_down":
      return (
        <svg {...svgProps}>
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );

    case "cloudy_snowing":
      return (
        <svg {...svgProps}>
          <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
          <line x1="8" y1="20" x2="8.01" y2="20" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
          <line x1="16" y1="20" x2="16.01" y2="20" />
        </svg>
      );

    case "cloud_upload":
      return (
        <svg {...svgProps}>
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      );

    case "edit_note":
      return (
        <svg {...svgProps}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );

    case "expand_more":
      return (
        <svg {...svgProps}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );

    case "arrow_back":
      return (
        <svg {...svgProps}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );

    case "arrow_forward":
      return (
        <svg {...svgProps}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );

    case "more_vert":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="5.5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="18.5" r="1.5" fill="currentColor" />
        </svg>
      );

    case "person":
      return (
        <svg {...svgProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case "close":
      return (
        <svg {...svgProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );

    case "menu":
      return (
        <svg {...svgProps}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );

    case "chevron_left":
      return (
        <svg {...svgProps}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );

    case "chevron_right":
      return (
        <svg {...svgProps}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );

    case "search":
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case "schedule":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );

    case "download":
      return (
        <svg {...svgProps}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );

    case "bolt":
      return (
        <svg {...svgProps}>
          <polygon
            points="13 2 3 14 11 14 11 22 21 10 13 10 13 2"
            fill={fill ? "currentColor" : "none"}
          />
        </svg>
      );

    case "tune":
      return (
        <svg {...svgProps}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="9" cy="6" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="18" r="2" fill="currentColor" />
        </svg>
      );

    case "check_circle":
      return (
        <svg {...svgProps}>
          <circle
            cx="12"
            cy="12"
            r="10"
            fill={fill ? "currentColor" : "none"}
          />
          <polyline
            points="8 12.5 10.5 15 16 9"
            stroke={fill ? "white" : "currentColor"}
          />
        </svg>
      );

    case "info":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="12" y1="7.5" x2="12.01" y2="7.5" />
        </svg>
      );

    case "edit":
      return (
        <svg {...svgProps}>
          <path d="M17 3a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L17 3z" />
        </svg>
      );

    case "favorite":
      return (
        <svg {...svgProps}>
          <path
            d="M12 21s-7.5-4.6-10-9.3C.5 8.3 2 4.5 5.6 4c2-.3 3.9.7 5 2.3C11.7 4.7 13.6 3.7 15.6 4c3.6.5 5.1 4.3 3.6 7.7C16.7 16.4 12 21 12 21z"
            fill={fill ? "currentColor" : "none"}
          />
        </svg>
      );

    case "calendar_today":
      return (
        <svg {...svgProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      );

    case "filter_list":
      return (
        <svg {...svgProps}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
      );

    case "auto_awesome":
      return (
        <svg {...svgProps}>
          <path
            d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"
            fill={fill ? "currentColor" : "none"}
          />
          <path d="M19 14l.7 1.9L21.5 16.5l-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7L19 14z" />
        </svg>
      );

    case "storefront":
      return (
        <svg {...svgProps}>
          <path d="M3 9l1-5h16l1 5" />
          <path d="M3 11v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" />
          <path d="M3 11a2 2 0 0 1 4 0 2 2 0 0 1 4 0 2 2 0 0 1 4 0 2 2 0 0 1 4 0" />
        </svg>
      );

    case "shopping_bag":
      return (
        <svg {...svgProps}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );

    case "star":
      return (
        <svg {...svgProps}>
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={fill ? "currentColor" : "none"}
          />
        </svg>
      );

    case "star_half":
      return (
        <svg {...svgProps}>
          <path d="M12 17.8L5.8 21 7 14.1 2 9.3l7-.9L12 2" />
        </svg>
      );

    case "rate_review":
    case "reviews":
      return (
        <svg {...svgProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z" />
        </svg>
      );

    default:
      return null;
  }
}
