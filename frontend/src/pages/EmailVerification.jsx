import React, { useState, useEffect } from 'react';
import NavBarForAuth from '../components/NavBarForAuth';

const EmailVerification = () => {
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <NavBarForAuth />
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-10">
        <div className="relative bg-white px-6 pt-5 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email ba**@dipainhouse.com</p>
              </div>
            </div>

            <div>
              <form>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          maxLength={1}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        type="submit"
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive code?</p>
                      <button
                        className={`flex flex-row items-center ${isResendEnabled ? 'text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
                        disabled={!isResendEnabled}
                        onClick={() => {
                          setTimer(120);
                          setIsResendEnabled(false);
                        }}
                      >
                        Resend
                      </button>
                    </div>

                    {!isResendEnabled && (
                      <div className="text-sm text-gray-500 text-center">
                        You can resend the code in {formatTime(timer)}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
