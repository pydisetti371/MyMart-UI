import type { ReactNode } from "react";

export type IconName =
  | "cart"
  | "receipt"
  | "box"
  | "history"
  | "chart"
  | "inventory"
  | "settings"
  | "sun"
  | "user"
  | "phone"
  | "list"
  | "trash"
  | "plus"
  | "minus"
  | "cash"
  | "upi"
  | "card"
  | "check"
  | "tag"
  | "printer";

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    cart: (
      <>
        <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 8H7" />
        <path d="M10 20h.01M18 20h.01M9 11l2 2 4-4" />
      </>
    ),
    receipt: (
      <>
        <path d="M6 3h9l4 4v14l-2-1.5L15 21l-2-1.5L11 21l-2-1.5L7 21l-1-1z" />
        <path d="M14 3v5h5M9 12h6M9 16h6" />
      </>
    ),
    box: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
    inventory: (
      <>
        <path d="M4 7h16v14H4zM3 4h18v3H3z" />
        <path d="M9 11h6M9 15h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.8l-1.7.6-1.4-2.4 1.5-1.2a7 7 0 0 1 0-1.7l-1.5-1.2 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.5 1.2a7 7 0 0 1 0 1.7Z"
          transform="translate(-1 -1)"
        />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    phone: (
      <path d="M6.6 3h3l1.5 4.5-2 1.6a15 15 0 0 0 5.8 5.8l1.6-2 4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3Z" />
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
    trash: <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    cash: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </>
    ),
    upi: <path d="m13 2-8 11h6l-1 9 9-12h-6z" />,
    card: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="M2.5 10h19M7 15h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    tag: (
      <>
        <path d="M20.5 13 13 20.5a2 2 0 0 1-3 0l-7-7V3h10l7.5 7.5a2 2 0 0 1 0 2.5Z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </>
    ),
    printer: (
      <>
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6zM18 12h.01" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}
