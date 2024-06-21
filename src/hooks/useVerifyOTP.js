import { useState } from "react";
import axios from "axios";

const useVerifyOTP = (setToken) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://api.testbuddy.live/v1/auth/verifyotp",
        {
          mobile: mobile,
          otp: otp,
        }
      );
      setToken(response.data.token);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Verification failed. Please try again."
      );
    }
    setLoading(false);
  };

  return {
    mobile,
    otp,
    loading,
    error,
    setMobile,
    setOtp,
    verifyOTP,
  };
};

export default useVerifyOTP;
