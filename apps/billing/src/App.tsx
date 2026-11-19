import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { NavLink } from "react-router";
import { billingCopy, initialBillItems } from "./constants";
import "./App.css";

type Product = {
  id: number;
  name: string;
  category: string;
  mrp: number;
  price: number;
  quantity: number;
};

type IconName =
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

const rupees = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatRupees(amount: number) {
  return `${billingCopy.currencySymbol} ${rupees.format(amount)}`;
}

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
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
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
      </>
    ),
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
    trash: (
      <>
        <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    cash: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </>
    ),
    upi: (
      <>
        <path d="m13 2-8 11h6l-1 9 9-12h-6z" />
      </>
    ),
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

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: IconName;
  label: string;
}) {
  const content = (
    <>
      <Icon name={icon} size={21} />
      <span>{label}</span>
    </>
  );

  if (href === "/products" || href === "/reports") {
    return (
      <span
        aria-disabled="true"
        className="nav-link is-disabled"
        title={billingCopy.navigation.comingSoon}
      >
        {content}
      </span>
    );
  }

  if (href.startsWith("/")) {
    return (
      <NavLink
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        end
        to={href}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a className="nav-link" href={href}>
      {content}
    </a>
  );
}

function App({ sidebarOpen = true }: { sidebarOpen?: boolean } = {}) {
  const [items, setItems] = useState<Product[]>(initialBillItems);
  const [productName, setProductName] = useState(
    billingCopy.defaults.productName,
  );
  const [category, setCategory] = useState(billingCopy.defaults.category);
  const [mrp, setMrp] = useState(billingCopy.defaults.mrp);
  const [price, setPrice] = useState(billingCopy.defaults.sellingPrice);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [billDiscountInput, setBillDiscountInput] = useState(
    billingCopy.defaults.billDiscount,
  );
  const [billDiscount, setBillDiscount] = useState(
    billingCopy.defaults.appliedBillDiscount,
  );
  const [paymentMethod, setPaymentMethod] = useState(
    billingCopy.defaults.paymentMethod,
  );
  const [notice, setNotice] = useState("");

  const summary = useMemo(() => {
    const totalMrp = items.reduce(
      (sum, item) => sum + item.mrp * item.quantity,
      0,
    );
    const sellingAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemSavings = totalMrp - sellingAmount;
    const discountAmount = (sellingAmount * billDiscount) / 100;
    return {
      totalMrp,
      sellingAmount,
      itemSavings,
      discountAmount,
      payable: sellingAmount - discountAmount,
    };
  }, [items, billDiscount]);

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = productName.trim();
    const mrpValue = Number(mrp);
    const priceValue = Number(price);
    if (
      !normalizedName ||
      !Number.isFinite(mrpValue) ||
      !Number.isFinite(priceValue) ||
      mrpValue < 0 ||
      priceValue < 0 ||
      quantity < 1
    ) {
      setNotice(billingCopy.messages.invalidItem);
      return;
    }
    const existing = items.find(
      (item) => item.name.toLowerCase() === normalizedName.toLowerCase(),
    );
    if (existing) {
      setItems((current) =>
        current.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setItems((current) => [
        ...current,
        {
          id: Date.now(),
          name: normalizedName,
          category,
          mrp: mrpValue,
          price: priceValue,
          quantity,
        },
      ]);
    }
    setQuantity(1);
    setNotice("");
  };

  const applyDiscount = () => {
    const value = Number(billDiscountInput);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setNotice(billingCopy.messages.invalidDiscount);
      return;
    }
    setBillDiscount(value);
    setNotice("");
  };

  const generateBill = () => {
    const normalizedCustomerName = customerName.trim();
    const normalizedMobileNumber = mobileNumber.trim();

    if (!normalizedCustomerName || !normalizedMobileNumber) {
      setNotice(billingCopy.messages.customerRequired);
      return;
    }

    setNotice(
      items.length
        ? billingCopy.messages.billGenerated(
            paymentMethod,
            normalizedCustomerName,
          )
        : billingCopy.messages.emptyBill,
    );
  };

  const changeQuantity = (id: number, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) =>
    setItems((current) => current.filter((item) => item.id !== id));

  return (
    <div className="billing-shell">
      <aside
        className={`sidebar${sidebarOpen ? "" : " is-hidden"}`}
        id="store-sidebar"
      >
        <nav aria-label={billingCopy.navigation.ariaLabel} className="side-nav">
          {(
            [
              ["receipt", billingCopy.navigation.billing, "/billing"],
              ["inventory", billingCopy.navigation.products, "/products"],
              ["chart", billingCopy.navigation.reports, "/reports"],
            ] as const
          ).map(([icon, label, href]) => (
            <SidebarLink href={href} icon={icon} key={label} label={label} />
          ))}
        </nav>

        <div className="store-time">
          <Icon name="sun" size={22} />
          <span>
            {billingCopy.store.date}
            <br />
            <strong>{billingCopy.store.time}</strong>
          </span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="page-heading">
            <h1>{billingCopy.page.title}</h1>
            <span className="pos-badge">{billingCopy.page.pos}</span>
          </div>
          <div className="top-actions">
            <button
              className="print-button"
              onClick={() => window.print()}
              type="button"
            >
              <Icon name="printer" size={19} /> {billingCopy.page.printReceipt}
            </button>
          </div>
        </header>

        <div className="workspace">
          <section
            aria-label={billingCopy.page.saleDetailsAriaLabel}
            className="sale-column"
          >
            <div className="entry-card">
              <section className="customer-section">
                <h2 className="section-heading">
                  <Icon name="user" size={24} />{" "}
                  <span>
                    {billingCopy.customer.sectionTitle}{" "}
                    <span
                      aria-label={billingCopy.customer.required}
                      className="required-indicator"
                    >
                      *
                    </span>
                  </span>
                </h2>
                <div className="customer-fields">
                  <label className="icon-input">
                    <Icon name="user" size={20} />
                    <input
                      aria-label={billingCopy.customer.nameAriaLabel}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder={billingCopy.customer.name}
                      required
                      value={customerName}
                    />
                  </label>
                  <label className="icon-input">
                    <Icon name="phone" size={20} />
                    <input
                      aria-label={billingCopy.customer.mobileAriaLabel}
                      inputMode="tel"
                      onChange={(event) => setMobileNumber(event.target.value)}
                      placeholder={billingCopy.customer.mobileNumber}
                      required
                      type="tel"
                      value={mobileNumber}
                    />
                  </label>
                </div>
              </section>

              <form className="item-form" onSubmit={addItem}>
                <h2 className="section-heading">
                  <Icon name="box" size={24} />{" "}
                  <span>{billingCopy.itemForm.title}</span>
                </h2>
                <div className="product-fields">
                  <label className="field">
                    <span>{billingCopy.itemForm.itemName}</span>
                    <input
                      onChange={(event) => setProductName(event.target.value)}
                      required
                      value={productName}
                    />
                  </label>
                  <label className="field">
                    <span>{billingCopy.itemForm.category}</span>
                    <select
                      onChange={(event) => setCategory(event.target.value)}
                      value={category}
                    >
                      {billingCopy.itemForm.categories.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>{`${billingCopy.itemForm.mrp} (${billingCopy.currencySymbol})`}</span>
                    <input
                      min="0"
                      onChange={(event) => setMrp(event.target.value)}
                      step="0.01"
                      type="number"
                      value={mrp}
                    />
                  </label>
                  <label className="field">
                    <span>{`${billingCopy.itemForm.sellingPrice} (${billingCopy.currencySymbol})`}</span>
                    <input
                      min="0"
                      onChange={(event) => setPrice(event.target.value)}
                      step="0.01"
                      type="number"
                      value={price}
                    />
                  </label>
                  <div className="field quantity-field">
                    <span>{billingCopy.itemForm.quantity}</span>
                    <div className="quantity-control">
                      <button
                        aria-label={billingCopy.itemForm.decreaseQuantity}
                        onClick={() =>
                          setQuantity((value) => Math.max(1, value - 1))
                        }
                        type="button"
                      >
                        <Icon name="minus" size={19} />
                      </button>
                      <output>{quantity}</output>
                      <button
                        aria-label={billingCopy.itemForm.increaseQuantity}
                        onClick={() => setQuantity((value) => value + 1)}
                        type="button"
                      >
                        <Icon name="plus" size={19} />
                      </button>
                    </div>
                  </div>
                  <label className="field discount-field">
                    <span>{billingCopy.itemForm.discount}</span>
                    <output>
                      {Number(mrp) > 0
                        ? `${Math.max(0, (1 - Number(price) / Number(mrp)) * 100).toFixed(2)}%`
                        : billingCopy.defaults.zeroDiscount}
                    </output>
                  </label>
                </div>
                <button className="add-button" type="submit">
                  <Icon name="plus" size={22} /> {billingCopy.itemForm.submit}
                </button>
              </form>
            </div>

            <section
              aria-labelledby="current-items-title"
              className="items-section"
            >
              <h2 className="items-title" id="current-items-title">
                <Icon name="list" size={23} /> {billingCopy.itemsTable.title}
              </h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.rowNumber}
                      </th>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.itemName}
                      </th>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.category}
                      </th>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.quantity}
                      </th>
                      <th scope="col">{`${billingCopy.itemsTable.columns.mrp} (${billingCopy.currencySymbol})`}</th>
                      <th scope="col">{`${billingCopy.itemsTable.columns.price} (${billingCopy.currencySymbol})`}</th>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.discount}
                      </th>
                      <th scope="col">{`${billingCopy.itemsTable.columns.total} (${billingCopy.currencySymbol})`}</th>
                      <th scope="col">
                        {billingCopy.itemsTable.columns.action}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length ? (
                      items.map((item, index) => {
                        const itemDiscount = item.mrp
                          ? ((item.mrp - item.price) / item.mrp) * 100
                          : 0;
                        return (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td className="product-name-cell">{item.name}</td>
                            <td>{item.category}</td>
                            <td>
                              <div className="table-quantity">
                                <button
                                  aria-label={billingCopy.itemsTable.decreaseQuantity(
                                    item.name,
                                  )}
                                  onClick={() => changeQuantity(item.id, -1)}
                                  type="button"
                                >
                                  −
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  aria-label={billingCopy.itemsTable.increaseQuantity(
                                    item.name,
                                  )}
                                  onClick={() => changeQuantity(item.id, 1)}
                                  type="button"
                                >
                                  {billingCopy.itemsTable.increaseSymbol}
                                </button>
                              </div>
                            </td>
                            <td>{rupees.format(item.mrp)}</td>
                            <td>{rupees.format(item.price)}</td>
                            <td>
                              <span className="saving-pill">
                                {itemDiscount.toFixed(2)}%
                              </span>
                            </td>
                            <td className="total-cell">
                              {rupees.format(item.price * item.quantity)}
                            </td>
                            <td>
                              <button
                                aria-label={billingCopy.itemsTable.removeItem(
                                  item.name,
                                )}
                                className="remove-button"
                                onClick={() => removeItem(item.id)}
                                type="button"
                              >
                                <Icon name="trash" size={17} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="empty-state" colSpan={9}>
                          {billingCopy.itemsTable.empty}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="discount-bar">
              <span className="tag-icon">
                <Icon name="tag" size={23} />
              </span>
              <strong>{billingCopy.billDiscount.title}</strong>
              <label className="discount-input">
                <input
                  aria-label={billingCopy.billDiscount.percentageAriaLabel}
                  max="100"
                  min="0"
                  onChange={(event) => setBillDiscountInput(event.target.value)}
                  type="number"
                  value={billDiscountInput}
                />
                <span>%</span>
              </label>
              <button
                className="apply-button"
                onClick={applyDiscount}
                type="button"
              >
                {billingCopy.billDiscount.apply}
              </button>
            </div>
            {notice && (
              <p aria-live="polite" className="notice">
                {notice}
              </p>
            )}
          </section>

          <aside
            aria-label={billingCopy.summary.ariaLabel}
            className="summary-card"
          >
            <h2 className="summary-heading">
              <Icon name="receipt" size={26} /> {billingCopy.summary.title}
            </h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>{billingCopy.summary.totalMrp}</span>
                <strong>{formatRupees(summary.totalMrp)}</strong>
              </div>
              <div className="summary-row">
                <span>{billingCopy.summary.sellingAmount}</span>
                <strong>{formatRupees(summary.sellingAmount)}</strong>
              </div>
              <div className="summary-row savings-row">
                <span>{billingCopy.summary.itemSavings}</span>
                <strong>{formatRupees(summary.itemSavings)}</strong>
              </div>
              <div className="summary-row bill-discount-row">
                <span>{billingCopy.summary.billDiscount}</span>
                <strong className="percentage-pill">{billDiscount}%</strong>
              </div>
              <div className="summary-row savings-row">
                <span>{billingCopy.summary.discountAmount}</span>
                <strong>{formatRupees(summary.discountAmount)}</strong>
              </div>
              <div className="payable-row">
                <span>{billingCopy.summary.finalPayable}</span>
                <strong>{formatRupees(summary.payable)}</strong>
              </div>

              <div
                aria-label={billingCopy.summary.paymentMethodAriaLabel}
                className="payment-options"
                role="group"
              >
                {billingCopy.summary.paymentMethods.map((method) => (
                  <button
                    aria-pressed={paymentMethod === method}
                    className={`payment-option${paymentMethod === method ? " selected" : ""}`}
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    type="button"
                  >
                    <Icon
                      name={
                        method === billingCopy.summary.paymentMethods[0]
                          ? "cash"
                          : method === billingCopy.summary.paymentMethods[1]
                            ? "upi"
                            : "card"
                      }
                      size={25}
                    />
                    <span>{method}</span>
                  </button>
                ))}
              </div>
              <button
                className="generate-button"
                onClick={generateBill}
                type="button"
              >
                <span className="check-circle">
                  <Icon name="check" size={17} />
                </span>{" "}
                {billingCopy.summary.generate}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
