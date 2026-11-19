import { NavLink } from "react-router";
import { reportsCopy, reportsMockData } from "./constants";
import "./App.css";

const navigation = [
  {
    enabled: true,
    href: "/billing",
    icon: "\u25A4",
    label: reportsCopy.navigation.billing,
  },
  {
    enabled: false,
    href: "/products",
    icon: "\u25A3",
    label: reportsCopy.navigation.products,
  },
  {
    enabled: false,
    href: "/reports",
    icon: "\u25A5",
    label: reportsCopy.navigation.reports,
  },
];

const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function StoreNavLink({ item }: { item: (typeof navigation)[number] }) {
  const content = (
    <>
      <span aria-hidden="true" className="reports-nav-icon">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </>
  );

  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        className="reports-nav-link is-disabled"
        title={reportsCopy.navigation.comingSoon}
      >
        {content}
      </span>
    );
  }

  if (item.href.startsWith("/")) {
    return (
      <NavLink
        className={({ isActive }) =>
          `reports-nav-link${isActive ? " active" : ""}`
        }
        end
        to={item.href}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a className="reports-nav-link" href={item.href}>
      {content}
    </a>
  );
}

function App({ sidebarOpen = true }: { sidebarOpen?: boolean } = {}) {
  return (
    <div className="reports-shell">
      <aside
        className={`reports-sidebar${sidebarOpen ? "" : " is-hidden"}`}
        id="store-sidebar"
      >
        <nav
          aria-label={reportsCopy.navigation.ariaLabel}
          className="reports-nav"
        >
          {navigation.map((item) => (
            <StoreNavLink item={item} key={item.label} />
          ))}
        </nav>
        <div className="reports-store-time">
          <span aria-hidden="true">&#9728;</span>
          <span>
            {reportsCopy.store.date}
            <br />
            <strong>{reportsCopy.store.time}</strong>
          </span>
        </div>
      </aside>

      <main className="reports-main">
        <header className="reports-header">
          <div>
            <p className="reports-eyebrow">{reportsCopy.page.eyebrow}</p>
            <h1>{reportsCopy.page.title}</h1>
            <p className="reports-subtitle">{reportsCopy.page.subtitle}</p>
          </div>
          <label className="reports-period">
            <span>{reportsCopy.period.label}</span>
            <select defaultValue={reportsCopy.period.options[0]}>
              {reportsCopy.period.options.map((period) => (
                <option key={period}>{period}</option>
              ))}
            </select>
          </label>
        </header>

        <section
          aria-label={reportsCopy.sections.summaryAriaLabel}
          className="reports-stats"
        >
          <article className="reports-stat-card">
            <span className="reports-stat-icon blue">&#8377;</span>
            <span className="reports-stat-label">
              {reportsCopy.summary.salesThisWeek}
            </span>
            <strong>
              {reportsCopy.currencySymbol}{" "}
              {money.format(reportsMockData.totalSales)}
            </strong>
            <small>
              <b>+{reportsMockData.salesGrowthPercent}%</b>{" "}
              {reportsCopy.summary.salesComparison}
            </small>
          </article>
          <article className="reports-stat-card">
            <span className="reports-stat-icon green">&#9635;</span>
            <span className="reports-stat-label">
              {reportsCopy.summary.billsGenerated}
            </span>
            <strong>{reportsMockData.bills}</strong>
            <small>
              <b>+{reportsMockData.additionalBills}</b>{" "}
              {reportsCopy.summary.salesComparison}
            </small>
          </article>
          <article className="reports-stat-card">
            <span className="reports-stat-icon violet">&#8599;</span>
            <span className="reports-stat-label">
              {reportsCopy.summary.averageBillValue}
            </span>
            <strong>
              {reportsCopy.currencySymbol}{" "}
              {money.format(reportsMockData.averageBillValue)}
            </strong>
            <small>{reportsCopy.summary.completedSales}</small>
          </article>
        </section>

        <div className="reports-content-grid">
          <section
            aria-labelledby="weekly-sales-title"
            className="reports-panel sales-chart-panel"
          >
            <div className="reports-panel-heading">
              <div>
                <h2 id="weekly-sales-title">{reportsCopy.salesTrend.title}</h2>
                <p>{reportsCopy.salesTrend.description}</p>
              </div>
              <span className="reports-chart-total">
                {reportsCopy.currencySymbol}{" "}
                {money.format(reportsMockData.chartTotal)}
              </span>
            </div>
            <div
              aria-label={reportsCopy.salesTrend.chartAriaLabel}
              className="sales-chart"
              role="img"
            >
              <div className="chart-guides">
                {reportsMockData.chartAxisLabels.map((label) => (
                  <span key={label}>
                    {reportsCopy.currencySymbol} {label}
                  </span>
                ))}
              </div>
              <div className="chart-bars">
                {reportsMockData.weeklySales.map((sale) => (
                  <div className="chart-column" key={sale.day}>
                    <div className="chart-bar-rail">
                      <div
                        className="chart-bar"
                        style={{ height: `${(sale.amount / 5000) * 100}%` }}
                        title={reportsCopy.salesTrend.chartBarTitle(
                          money.format(sale.amount),
                        )}
                      />
                    </div>
                    <span>{sale.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="top-products-title"
            className="reports-panel top-products-panel"
          >
            <div className="reports-panel-heading">
              <div>
                <h2 id="top-products-title">{reportsCopy.topProducts.title}</h2>
                <p>{reportsCopy.topProducts.description}</p>
              </div>
            </div>
            <ol className="top-products-list">
              {reportsMockData.topProducts.map((product, index) => (
                <li key={product.name}>
                  <span className="top-product-rank">0{index + 1}</span>
                  <span className="top-product-info">
                    <strong>{product.name}</strong>
                    <small>
                      {reportsCopy.topProducts.soldCount(product.sold)}
                    </small>
                  </span>
                  <strong className="top-product-total">
                    {reportsCopy.currencySymbol} {money.format(product.amount)}
                  </strong>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
