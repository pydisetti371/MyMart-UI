import { useState } from "react";
import { NavLink } from "react-router";
import { productsCopy, productsMockData } from "./constants";
import "./App.css";

type NavItem = {
  enabled: boolean;
  href: string;
  icon: string;
  label: string;
};

const navigation: NavItem[] = [
  {
    enabled: true,
    href: "/billing",
    icon: "\u25A4",
    label: productsCopy.navigation.billing,
  },
  {
    enabled: false,
    href: "/products",
    icon: "\u25A3",
    label: productsCopy.navigation.products,
  },
  {
    enabled: false,
    href: "/reports",
    icon: "\u25A5",
    label: productsCopy.navigation.reports,
  },
];

const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

function StoreNavLink({ item }: { item: NavItem }) {
  const content = (
    <>
      <span aria-hidden="true" className="products-nav-icon">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </>
  );

  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        className="products-nav-link is-disabled"
        title={productsCopy.navigation.comingSoon}
      >
        {content}
      </span>
    );
  }

  if (item.href.startsWith("/")) {
    return (
      <NavLink
        className={({ isActive }) =>
          `products-nav-link${isActive ? " active" : ""}`
        }
        end
        to={item.href}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a className="products-nav-link" href={item.href}>
      {content}
    </a>
  );
}

function App({ sidebarOpen = true }: { sidebarOpen?: boolean } = {}) {
  const [search, setSearch] = useState("");
  const filteredProducts = productsMockData.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="products-shell">
      <aside
        className={`products-sidebar${sidebarOpen ? "" : " is-hidden"}`}
        id="store-sidebar"
      >
        <nav
          aria-label={productsCopy.navigation.ariaLabel}
          className="products-nav"
        >
          {navigation.map((item) => (
            <StoreNavLink item={item} key={item.label} />
          ))}
        </nav>
        <div className="products-store-time">
          <span aria-hidden="true">&#9728;</span>
          <span>
            {productsCopy.store.date}
            <br />
            <strong>{productsCopy.store.time}</strong>
          </span>
        </div>
      </aside>

      <main className="products-main">
        <header className="products-header">
          <div>
            <p className="products-eyebrow">{productsCopy.page.eyebrow}</p>
            <h1>{productsCopy.page.title}</h1>
            <p className="products-subtitle">{productsCopy.page.subtitle}</p>
          </div>
          <button
            className="products-add-button"
            onClick={() => window.alert(productsCopy.page.addProductNotice)}
            type="button"
          >
            <span aria-hidden="true">&#43;</span> {productsCopy.page.addProduct}
          </button>
        </header>

        <section
          aria-label={productsCopy.page.overviewAriaLabel}
          className="products-stats"
        >
          <article className="products-stat-card">
            <span className="products-stat-icon blue">&#9635;</span>
            <span className="products-stat-label">
              {productsCopy.inventory.totalProducts}
            </span>
            <strong>{productsMockData.length}</strong>
            <small>{productsCopy.inventory.totalProductsDescription}</small>
          </article>
          <article className="products-stat-card">
            <span className="products-stat-icon green">&#10003;</span>
            <span className="products-stat-label">
              {productsCopy.inventory.inStock}
            </span>
            <strong>
              {productsMockData.filter((product) => product.stock > 0).length}
            </strong>
            <small>{productsCopy.inventory.inStockDescription}</small>
          </article>
          <article className="products-stat-card">
            <span className="products-stat-icon amber">!</span>
            <span className="products-stat-label">
              {productsCopy.inventory.lowStock}
            </span>
            <strong>
              {productsMockData.filter((product) => product.stock < 10).length}
            </strong>
            <small>{productsCopy.inventory.lowStockDescription}</small>
          </article>
          <article className="products-stat-card">
            <span className="products-stat-icon violet">&#8377;</span>
            <span className="products-stat-label">
              {productsCopy.inventory.catalogueValue}
            </span>
            <strong>
              {productsCopy.currencySymbol}{" "}
              {money.format(
                productsMockData.reduce(
                  (total, product) => total + product.price * product.stock,
                  0,
                ),
              )}
            </strong>
            <small>{productsCopy.inventory.catalogueValueDescription}</small>
          </article>
        </section>

        <section
          aria-labelledby="product-list-title"
          className="products-list-card"
        >
          <div className="products-list-heading">
            <div>
              <h2 id="product-list-title">{productsCopy.catalogue.title}</h2>
              <p>{productsCopy.catalogue.description}</p>
            </div>
            <label className="products-search">
              <span aria-hidden="true">&#9906;</span>
              <input
                aria-label={productsCopy.catalogue.searchAriaLabel}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={productsCopy.catalogue.searchPlaceholder}
                value={search}
              />
            </label>
          </div>
          <div className="products-table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th scope="col">{productsCopy.catalogue.columns.product}</th>
                  <th scope="col">{productsCopy.catalogue.columns.sku}</th>
                  <th scope="col">{productsCopy.catalogue.columns.category}</th>
                  <th scope="col">
                    {productsCopy.catalogue.columns.sellingPrice}
                  </th>
                  <th scope="col">{productsCopy.catalogue.columns.stock}</th>
                  <th scope="col">{productsCopy.catalogue.columns.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <tr key={product.sku}>
                      <td className="products-name">{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>
                        {productsCopy.currencySymbol}{" "}
                        {money.format(product.price)}
                      </td>
                      <td>{productsCopy.catalogue.units(product.stock)}</td>
                      <td>
                        <span
                          className={`stock-badge${product.stock < 10 ? " low" : ""}`}
                        >
                          {product.stock < 10
                            ? productsCopy.catalogue.lowStockStatus
                            : productsCopy.catalogue.inStockStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="products-empty" colSpan={6}>
                      {productsCopy.catalogue.noSearchResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
