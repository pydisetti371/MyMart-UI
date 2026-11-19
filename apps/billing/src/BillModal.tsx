import { Icon } from "./BillingIcons";
import { billingCopy } from "./constants";
import { formatRupees } from "./BillingUtils";
import type { ReceiptSnapshot } from "./BillingTypes";

type BillModalProps = {
  isGeneratingBill: boolean;
  open: boolean;
  receipt: ReceiptSnapshot | null;
  onClose: () => void;
};

export function BillModal({
  isGeneratingBill,
  open,
  receipt,
  onClose,
}: BillModalProps) {
  if (!open) return null;

  return (
    <div className="bill-modal-backdrop">
      <section
        aria-labelledby="bill-modal-title"
        aria-modal="true"
        className="bill-modal"
        role="dialog"
      >
        {isGeneratingBill ? (
          <div aria-live="polite" className="bill-modal-loading" role="status">
            <span aria-hidden="true" className="bill-modal-spinner" />
            <h2 id="bill-modal-title">{billingCopy.messages.generatingBill}</h2>
            <p>{billingCopy.messages.preparingReceipt}</p>
          </div>
        ) : receipt ? (
          <>
            <div aria-hidden="true" className="bill-modal-success-icon">
              <Icon name="check" size={26} />
            </div>
            <h2 id="bill-modal-title">
              {billingCopy.messages.billGeneratedTitle}
            </h2>
            <p className="bill-modal-description">
              {billingCopy.messages.billGeneratedDescription}
            </p>
            <div className="bill-modal-summary">
              <span>{billingCopy.receipt.invoiceNumber}</span>
              <strong>{receipt.invoiceNumber}</strong>
              <span>{billingCopy.summary.finalPayable}</span>
              <strong>{formatRupees(receipt.payable)}</strong>
            </div>
            <div className="bill-modal-actions">
              <button
                className="bill-modal-secondary"
                onClick={() => onClose()}
                type="button"
              >
                {billingCopy.messages.done}
              </button>
              <button
                className="bill-modal-primary"
                onClick={() => window.print()}
                type="button"
              >
                <Icon name="printer" size={18} />
                {billingCopy.page.printReceipt}
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
