export const reportsCopy = {
  documentTitle: "MyMart | Reports",
  currencySymbol: "\u20B9",
  navigation: {
    ariaLabel: "Main navigation",
    billing: "Billing",
    products: "Products",
    reports: "Reports",
  },
  store: {
    date: "Mon, 16 Jun 2025",
    time: "10:24 AM",
  },
  page: {
    eyebrow: "STORE PERFORMANCE",
    title: "Reports",
    subtitle: "A quick view of your sales and best-selling products.",
  },
  sections: {
    summaryAriaLabel: "Sales summary",
  },
  period: {
    label: "Period",
    options: ["This week", "This month", "This year"],
  },
  summary: {
    salesThisWeek: "Sales this week",
    billsGenerated: "Bills generated",
    averageBillValue: "Average bill value",
    salesComparison: "compared with last week",
    completedSales: "Across completed sales",
  },
  salesTrend: {
    title: "Sales trend",
    description: "Daily sales for the selected period",
    chartAriaLabel: "Sales from Monday to Sunday",
    chartBarTitle: (amount: string) =>
      `${reportsCopy.currencySymbol} ${amount}`,
  },
  topProducts: {
    title: "Top products",
    description: "Best sellers this week",
    soldCount: (count: number) => `${count} items sold`,
  },
};

export const reportsMockData = {
  chartTotal: 24580,
  chartAxisLabels: ["5k", "3.5k", "2k", "0"],
  weeklySales: [
    { day: "Mon", amount: 2450 },
    { day: "Tue", amount: 3180 },
    { day: "Wed", amount: 2860 },
    { day: "Thu", amount: 3720 },
    { day: "Fri", amount: 3360 },
    { day: "Sat", amount: 4890 },
    { day: "Sun", amount: 4120 },
  ],
  topProducts: [
    { name: "Rice 1kg", sold: 42, amount: 4620 },
    { name: "Sunflower Oil 1L", sold: 28, amount: 4480 },
    { name: "Lux Soap", sold: 36, amount: 1620 },
    { name: "Tata Tea 250g", sold: 17, amount: 2465 },
  ],
  totalSales: 24580,
  salesGrowthPercent: 12.8,
  bills: 86,
  additionalBills: 8,
  averageBillValue: 286,
};
