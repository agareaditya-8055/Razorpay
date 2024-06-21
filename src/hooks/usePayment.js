import { useState, useEffect, useRef } from "react";
import axios from "axios";

const usePayment = (token) => {
  const [razorpayKey, setRazorpayKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const orderIdRef = useRef("");

  useEffect(() => {
    const getRazorpayKey = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          "https://api.testbuddy.live/v1/payment/key",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRazorpayKey(response.data.key);
      } catch (err) {
        setError(err?.response?.data?.message);
      }
      setLoading(false);
    };

    getRazorpayKey();
  }, [token]);

  const createOrder = async () => {
    if (!razorpayKey) {
      setError("Razorpay key is not set");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://api.testbuddy.live/v1/order/create",
        {
          packageId: "6613d6fbbf1afca9aa1b519e",
          pricingId: "662caa2d50bf43b5cef75232",
          finalAmount: "441",
          couponCode: "NEET25",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      orderIdRef.current = response.data._id;
      initiateRazorpayPayment(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
    setLoading(false);
  };

  const initiateRazorpayPayment = async (order) => {
    if (!razorpayKey) {
      setError("Razorpay key is not set");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load payment gateway. Please try again.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: "INR",
      name: "TestBuddy",
      description: "Test Transaction",
      order_id: order.transactionOrderId,
      handler: async (response) => {
        await verifyOrder(response);
      },
      prefill: {
        name: "Test User",
        email: "test.user@example.com",
        contact: "919090909090",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const verifyOrder = async (response) => {
    const { razorpay_payment_id, razorpay_signature } = response;

    if (!razorpay_payment_id || !razorpay_signature) {
      setError("Payment verification failed. Please try again.");
      return;
    }

    try {
      const requestData = {
        transactionId: orderIdRef.current,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      };

      await axios.post(
        "https://api.testbuddy.live/v1/order/verify",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message);
    }
  };

  return {
    loading,
    error,
    paymentSuccess,
    createOrder,
  };
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default usePayment;
