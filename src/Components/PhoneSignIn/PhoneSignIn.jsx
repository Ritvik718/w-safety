import React, { useState } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // Recaptcha solved, allow signInWithPhoneNumber.
          },
          "expired-callback": () => {
            // Reset reCAPTCHA?
            window.recaptchaVerifier.render().then(function (widgetId) {
              grecaptcha.reset(widgetId);
            });
          },
        },
        auth
      );
    }
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (verificationId) {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      auth
        .signInWithCredential(credential)
        .then(() => {
          navigate("/"); // Navigate to home on success
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError("No verification ID available. Please request a new code.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Phone Sign In
        </h2>
        <form onSubmit={handleSendCode}>
          <div className="mb-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-300"
          >
            Send Code
          </button>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
        {verificationId && (
          <form onSubmit={handleVerifyCode} className="mt-6">
            <div className="mb-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition duration-300"
            >
              Verify Code
            </button>
          </form>
        )}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneSignIn;
