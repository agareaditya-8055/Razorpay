import React from "react";
import useVerifyOTP from "../hooks/useVerifyOTP";
import "./VerifyOTP.css";

const VerifyOTP = ({ setToken }) => {
  const { mobile, otp, loading, error, setMobile, setOtp, verifyOTP } =
    useVerifyOTP(setToken);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md animate-slideIn">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          className="mb-4 p-2 border rounded w-full"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile Number"
        />
        <input
          type="text"
          className="mb-4 p-2 border rounded w-full"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 w-full"
          onClick={verifyOTP}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
