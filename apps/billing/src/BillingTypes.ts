export type Product = {
  id: number;
  name: string;
  category: string;
  mrp: number;
  price: number;
  quantity: number;
};

export type ReceiptSnapshot = {
  invoiceNumber: string;
  generatedAt: Date;
  customerName: string;
  mobileNumber: string;
  items: Product[];
  totalMrp: number;
  sellingAmount: number;
  itemSavings: number;
  billDiscount: number;
  discountAmount: number;
  payable: number;
  paymentMethod: string;
};
