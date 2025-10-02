/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

/*
 * TODO: needed to be migrate into nextjs api for security reasons.
 * This is a temporary solution to allow users to print and download their order receipts.
 * In production, consider implementing server-side rendering for sensitive data.
 */

interface OrderReceiptProps {
  order: {
    id: string;
    created_at: string;
    total: number;
    status: string;
    delivery_name: string;
    delivery_phone: string;
    delivery_address: string;
    payment_ref?: string;
    payment_method?: string;
    items: Array<{
      product: {
        name: string;
        image: string;
      };
      quantity: number;
      price: number;
    }>;
  };
  transactionRef?: string | null;
}

export function OrderReceipt({ order, transactionRef }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Ulisha Store - Order Receipt</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .receipt-header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 1px solid #eee;
                  padding-bottom: 20px;
                }
                .receipt-header h1 {
                  color: #FF6B00;
                  margin-bottom: 5px;
                }
                .receipt-section {
                  margin-bottom: 20px;
                }
                .receipt-section h2 {
                  border-bottom: 1px solid #eee;
                  padding-bottom: 5px;
                  margin-bottom: 10px;
                  font-size: 18px;
                }
                .receipt-info {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                }
                .receipt-info span:first-child {
                  font-weight: bold;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
                th, td {
                  padding: 10px;
                  text-align: left;
                  border-bottom: 1px solid #eee;
                }
                th {
                  background-color: #f8f8f8;
                }
                .total-row {
                  font-weight: bold;
                  font-size: 16px;
                }
                .verification-code {
                  text-align: center;
                  margin: 20px 0;
                  padding: 10px;
                  background-color: #f8f8f8;
                  border: 1px dashed #ccc;
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 5px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 12px;
                  color: #666;
                }
                @media print {
                  body {
                    padding: 0;
                    margin: 0;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleDownload = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (printContent) {
      const blob = new Blob(
        [
          `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Ulisha Store - Order Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .receipt-header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
              }
              .receipt-header h1 {
                color: #FF6B00;
                margin-bottom: 5px;
              }
              .receipt-section {
                margin-bottom: 20px;
              }
              .receipt-section h2 {
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
                margin-bottom: 10px;
                font-size: 18px;
              }
              .receipt-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .receipt-info span:first-child {
                font-weight: bold;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #eee;
              }
              th {
                background-color: #f8f8f8;
              }
              .total-row {
                font-weight: bold;
                font-size: 16px;
              }
              .verification-code {
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                background-color: #f8f8f8;
                border: 1px dashed #ccc;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 5px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `,
        ],
        { type: "text/html" }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order-receipt-${order.id.substring(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // Generate a verification code from the order ID and transaction reference
  const generateVerificationCode = () => {
    const orderId = order.id.substring(0, 6);
    const timestamp = new Date(order.created_at)
      .getTime()
      .toString()
      .substring(5, 10);
    return `${orderId}${timestamp}`.toUpperCase();
  };

  const verificationCode = generateVerificationCode();
  const orderDate = new Date(order.created_at).toLocaleDateString();
  const orderTime = new Date(order.created_at).toLocaleTimeString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Order Receipt</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faPrint} className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-500/90 text-white px-3 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div ref={receiptRef}>
        <div className="receipt-header">
          <h1 className="text-2xl font-bold text-primary-orange">
            Ulisha Store
          </h1>
          <p>Premium Fiat and Crypto E-commerce</p>
        </div>

        <div className="receipt-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Order Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="receipt-info">
                <span className="font-medium">Order ID:</span>
                <span>{order.id.substring(0, 8)}</span>
              </div>
              <div className="receipt-info">
                <span className="font-medium">Date:</span>
                <span>{orderDate}</span>
              </div>
              <div className="receipt-info">
                <span className="font-medium">Time:</span>
                <span>{orderTime}</span>
              </div>
              <div className="receipt-info">
                <span className="font-medium">Status:</span>
                <span
                  className={
                    order.status === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <div className="receipt-info">
                <span className="font-medium">Payment Method:</span>
                <span>
                  {order.payment_method
                    ? order.payment_method.charAt(0).toUpperCase() +
                      order.payment_method.slice(1)
                    : "Flutterwave"}
                </span>
              </div>
              {transactionRef && (
                <div className="receipt-info">
                  <span className="font-medium">Transaction Ref:</span>
                  <span>{transactionRef}</span>
                </div>
              )}
              {order.payment_ref && (
                <div className="receipt-info">
                  <span className="font-medium">Payment Ref:</span>
                  <span>{order.payment_ref}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="receipt-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <div className="receipt-info">
              <span className="font-medium">Name:</span>
              <span>{order.delivery_name}</span>
            </div>
            <div className="receipt-info">
              <span className="font-medium">Phone:</span>
              <span>{order.delivery_phone}</span>
            </div>
            <div className="receipt-info">
              <span className="font-medium">Delivery Address:</span>
              <span>{order.delivery_address}</span>
            </div>
          </div>
        </div>

        <div className="receipt-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Order Items
          </h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Price</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.price)}
                  </td>
                  <td className="text-right">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={3} className="text-right">
                  Total:
                </td>
                <td className="text-right">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(order.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="receipt-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery Verification
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Present this code to the delivery personnel to verify your order.
          </p>
          <div className="verification-code">{verificationCode}</div>
        </div>

        <div className="footer">
          <p>Thank you for shopping with Ulisha Store!</p>
          <p>For any inquiries, please contact support@ulishastore.com</p>
          <p>© {new Date().getFullYear()} Ulisha Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
