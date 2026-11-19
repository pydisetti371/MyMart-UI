import { billingCopy } from "./constants";
import { formatRupees } from "./BillingUtils";
import type { ReceiptSnapshot } from "./BillingTypes";

export function ReceiptPreview({ receipt }: { receipt: ReceiptSnapshot }) {
  return (
    <section
      aria-label={billingCopy.messages.generatedReceipt}
      className="receipt-preview-section"
    >
      <p className="receipt-preview-hint">
        {billingCopy.messages.receiptReady}
      </p>
      <article className="receipt-paper" id="receipt-print-area">
        <header className="receipt-header">
          <h2>{billingCopy.receipt.merchantName}</h2>
          <p>{billingCopy.receipt.subtitle}</p>
          <strong>{billingCopy.receipt.customerCopy}</strong>
        </header>

        <p className="receipt-demo-notice">{billingCopy.receipt.demoNotice}</p>

        <div className="receipt-meta">
          <div>
            <span>{billingCopy.receipt.invoiceNumber}</span>
            <strong>{receipt.invoiceNumber}</strong>
          </div>
          <div>
            <span>{billingCopy.receipt.date}</span>
            <strong>
              {new Intl.DateTimeFormat("en-IN", {
                dateStyle: "medium",
              }).format(receipt.generatedAt)}
            </strong>
          </div>
          <div>
            <span>{billingCopy.receipt.time}</span>
            <strong>
              {new Intl.DateTimeFormat("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(receipt.generatedAt)}
            </strong>
          </div>
        </div>

        <div className="receipt-divider" />

        <section className="receipt-customer">
          <h3>{billingCopy.customer.sectionTitle}</h3>
          <p>
            <span>{billingCopy.receipt.customerName}</span>
            <strong>{receipt.customerName}</strong>
          </p>
          <p>
            <span>{billingCopy.receipt.mobileNumber}</span>
            <strong>{receipt.mobileNumber}</strong>
          </p>
        </section>

        <div className="receipt-divider" />

        <section aria-label={billingCopy.receipt.items}>
          <h3 className="receipt-section-title">{billingCopy.receipt.items}</h3>
          {receipt.items.map((item) => {
            const itemDiscount = item.mrp
              ? Math.max(0, ((item.mrp - item.price) / item.mrp) * 100)
              : 0;
            const itemSavings = Math.max(
              0,
              (item.mrp - item.price) * item.quantity,
            );

            return (
              <div className="receipt-item" key={item.id}>
                <strong className="receipt-item-name">{item.name}</strong>
                <div className="receipt-line">
                  <span>
                    {item.quantity} × {formatRupees(item.price)}
                  </span>
                  <strong>{formatRupees(item.price * item.quantity)}</strong>
                </div>
                <p className="receipt-item-detail">
                  {item.category} · MRP {formatRupees(item.mrp)}
                </p>
                <p className="receipt-item-detail">
                  Discount {itemDiscount.toFixed(2)}% · Savings{" "}
                  {formatRupees(itemSavings)}
                </p>
              </div>
            );
          })}
        </section>

        <div className="receipt-divider" />

        <div className="receipt-totals">
          <p>
            <span>{billingCopy.receipt.totalMrp}</span>
            <strong>{formatRupees(receipt.totalMrp)}</strong>
          </p>
          <p>
            <span>{billingCopy.receipt.itemSavings}</span>
            <strong>{formatRupees(receipt.itemSavings)}</strong>
          </p>
          <p>
            <span>{billingCopy.receipt.subtotal}</span>
            <strong>{formatRupees(receipt.sellingAmount)}</strong>
          </p>
          <p>
            <span>
              {billingCopy.receipt.retailDiscount} ({receipt.billDiscount}%)
            </span>
            <strong>− {formatRupees(receipt.discountAmount)}</strong>
          </p>
          <p className="receipt-total">
            <span>{billingCopy.receipt.total}</span>
            <strong>{formatRupees(receipt.payable)}</strong>
          </p>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-payment">
          <p>
            <span>{billingCopy.receipt.paymentMethod}</span>
            <strong>{receipt.paymentMethod}</strong>
          </p>
          <p className="receipt-mock-payment">
            {billingCopy.receipt.mockPayment}
          </p>
        </div>

        <footer className="receipt-footer">
          <p>{billingCopy.receipt.thankYou}</p>
          <span>*** CUSTOMER COPY ***</span>
        </footer>
      </article>
    </section>
  );
}
