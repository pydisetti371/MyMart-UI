export const hostCopy = {
  documentTitle: "MyMart | Departmental Store",
  metaDescription:
    "MyMart departmental store point of sale and inventory management.",
  brand: "MyMart",
  brandAriaLabel: "MyMart home",
  menu: {
    hideSidebar: "Hide sidebar",
    showSidebar: "Show sidebar",
  },
  navigation: {
    ariaLabel: "Store sections",
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
  { label: hostCopy.navigation.billing, path: "/billing" },
  { label: hostCopy.navigation.products, path: "/products" },
  { label: hostCopy.navigation.reports, path: "/reports" },
] as const;
