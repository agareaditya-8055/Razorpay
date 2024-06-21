import React from "react";
import usePayment from "../hooks/usePayment";
import "./Payment.css";

const Payment = ({ token }) => {
  const { loading, error, paymentSuccess, createOrder } = usePayment(token);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Make Payment</h2>
      {loading ? (
        <div className="spinner"></div>
      ) : paymentSuccess ? (
        <div className="text-green-500 text-center text-xl font-semibold animate-fadeIn">
          Payment successful! Thank you for your purchase.
        </div>
      ) : (
        <>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="bg-white shadow-md rounded p-4 mb-4 w-full max-w-md">
            <p className="text-lg">
              <strong>Package:</strong> NEET Preparation
            </p>
            <p className="text-lg">
              <strong>Price:</strong> ₹441
            </p>
            <p className="text-lg">
              <strong>Coupon:</strong> NEET25
            </p>
            <p className="text-lg">
              <strong>Final Amount:</strong> ₹331
            </p>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
            onClick={createOrder}
          >
            Pay Now
          </button>
        </>
      )}
    </div>
  );
};

export default Payment;
