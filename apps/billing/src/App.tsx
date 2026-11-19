import { useMemo, useState, type FormEvent } from "react";
import { billingCopy, initialBillItems } from "./constants";
import { BillModal } from "./BillModal";
import { BillingSidebar } from "./BillingSidebar";
import { ReceiptPreview } from "./ReceiptPreview";
import { Icon } from "./BillingIcons";
import {
  mobileNumberPattern,
  formatAmount,
  formatRupees,
} from "./BillingUtils";
import type { Product, ReceiptSnapshot } from "./BillingTypes";
import "./App.css";

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
  const [generatedReceipt, setGeneratedReceipt] =
    useState<ReceiptSnapshot | null>(null);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);

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
    setGeneratedReceipt(null);
    setNotice("");
  };

  const applyDiscount = () => {
    const value = Number(billDiscountInput);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setNotice(billingCopy.messages.invalidDiscount);
      return;
    }
    setBillDiscount(value);
    setGeneratedReceipt(null);
    setNotice("");
  };

  const generateBill = async () => {
    const normalizedCustomerName = customerName.trim();
    const normalizedMobileNumber = mobileNumber.trim();

    if (!normalizedCustomerName || !normalizedMobileNumber) {
      setGeneratedReceipt(null);
      setNotice(billingCopy.messages.customerRequired);
      return;
    }
    if (!mobileNumberPattern.test(normalizedMobileNumber)) {
      setGeneratedReceipt(null);
      setNotice(billingCopy.messages.invalidCustomerMobile);
      return;
    }

    if (!items.length) {
      setGeneratedReceipt(null);
      setNotice(billingCopy.messages.emptyBill);
      return;
    }

    const generatedAt = new Date();
    const receipt: ReceiptSnapshot = {
      invoiceNumber: `VM-${generatedAt.getTime()}`,
      generatedAt,
      customerName: normalizedCustomerName,
      mobileNumber: normalizedMobileNumber,
      items: items.map((item) => ({ ...item })),
      totalMrp: summary.totalMrp,
      sellingAmount: summary.sellingAmount,
      itemSavings: summary.itemSavings,
      billDiscount,
      discountAmount: summary.discountAmount,
      payable: summary.payable,
      paymentMethod,
    };

    setIsGeneratingBill(true);
    setBillModalOpen(true);
    setNotice("");
    await new Promise((resolve) => window.setTimeout(resolve, 750));
    setGeneratedReceipt(receipt);
    setIsGeneratingBill(false);
  };

  const changeQuantity = (id: number, delta: number) => {
    setGeneratedReceipt(null);
    setNotice("");
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setGeneratedReceipt(null);
    setNotice("");
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="billing-shell">
      <BillingSidebar sidebarOpen={sidebarOpen} />

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
              disabled={!generatedReceipt}
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
                      onChange={(event) => {
                        setCustomerName(event.target.value);
                        setGeneratedReceipt(null);
                        setNotice("");
                      }}
                      placeholder={billingCopy.customer.name}
                      required
                      value={customerName}
                    />
                  </label>
                  <label className="icon-input">
                    <Icon name="phone" size={20} />
                    <input
                      aria-label={billingCopy.customer.mobileAriaLabel}
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(event) => {
                        setMobileNumber(
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        );
                        setGeneratedReceipt(null);
                        setNotice("");
                      }}
                      pattern="[0-9]{10}"
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
                            <td>{formatAmount(item.mrp)}</td>
                            <td>{formatAmount(item.price)}</td>
                            <td>
                              <span className="saving-pill">
                                {itemDiscount.toFixed(2)}%
                              </span>
                            </td>
                            <td className="total-cell">
                              {formatAmount(item.price * item.quantity)}
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
                    onClick={() => {
                      setPaymentMethod(method);
                      setGeneratedReceipt(null);
                      setNotice("");
                    }}
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
                aria-busy={isGeneratingBill}
                className="generate-button"
                disabled={isGeneratingBill}
                onClick={generateBill}
                type="button"
              >
                {isGeneratingBill ? (
                  <>
                    <span aria-hidden="true" className="inline-spinner" />
                    {billingCopy.messages.generatingBill}
                  </>
                ) : (
                  <>
                    <span className="check-circle">
                      <Icon name="check" size={17} />
                    </span>{" "}
                    {billingCopy.summary.generate}
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
        {generatedReceipt && <ReceiptPreview receipt={generatedReceipt} />}
      </main>
      <BillModal
        isGeneratingBill={isGeneratingBill}
        open={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        receipt={generatedReceipt}
      />
    </div>
  );
}

export default App;
