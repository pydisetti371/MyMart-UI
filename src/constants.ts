export const hostCopy = {
  documentTitle: "VMart | Departmental Store",
  metaDescription:
    "VMart departmental store point of sale and inventory management.",
  brand: "VMart",
  brandAriaLabel: "VMart home",
  menu: {
    hideSidebar: "Hide sidebar",
    showSidebar: "Show sidebar",
  },
  navigation: {
    ariaLabel: "Store sections",
    comingSoon: "Coming soon",
    billing: "Billing",
    products: "Products",
    reports: "Reports",
  },
  pages: {
    loading: "Loading app...",
    chooseApp: "Choose an app from the menu.",
    notFound: "Page not found.",
  },
};

export const storeSections = [
  { label: hostCopy.navigation.billing, path: "/billing", enabled: true },
  { label: hostCopy.navigation.products, path: "/products", enabled: false },
  { label: hostCopy.navigation.reports, path: "/reports", enabled: false },
] as const;
