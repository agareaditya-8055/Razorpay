import React, { useState } from "react";
import VerifyOTP from "./components/VerifyOTP";
import Payment from "./components/Payment";

const App = () => {
  const [token, setToken] = useState("");

  return (
    <div className="App min-h-screen">
      {!token ? <VerifyOTP setToken={setToken} /> : <Payment token={token} />}
    </div>
  );
};

export default App;
