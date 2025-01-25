import React, { useState, useEffect } from 'react';
import NavBarForAuth from '../components/NavBarForAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill("")); 
  const [user, setUser] = useState({});
   
   const navigate = useNavigate()
 
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    setUser(storedUser);
  }, []); 
  
 
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

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus on next input if the value is valid and not the last input
      if (value && index < otp.length - 1) {
        element.nextSibling?.focus();
      }
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("OTP Entered:", otpValue);

    try {
      // Verify OTP
      const otpResponse = await axios.get(`https://task-racker.onrender.com/auth/readOtpForEmailVerificatonOtp`, {
        params: { otp: otpValue, email: user.email }
      });
      console.log('OTP verified successfully', otpResponse);

      
      if (otpResponse.data.verify === "true") {
        
     

        const registerResponse = await axios.post(`https://task-racker.onrender.com/auth/register`, {
          "email": user.email,
          "password": user.password,
          "role": user.role,
          "name": user.name,
          "address": user.address,
          "contact": user.contact,
          "city": user.city,
          "state": user.state,
          "pincode": user.pincode
        } );
        console.log('User registered successfully', registerResponse);

        
        if (registerResponse) {
          sessionStorage.removeItem('user')
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP or registering user', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs gap-2">
                    {otp.map((data, index) => (
                      <div key={index} className="w-10 h-10">
                        <input
                          className="w-full h-full flex flex-col items-center justify-center text-center px-1 outline-none rounded-lg border border-gray-500 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          maxLength={1}
                          value={data}
                          onChange={(e) => handleOtpChange(e.target, index)}
                          onFocus={(e) => e.target.select()} 
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        type="submit"
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-3 bg-blue-700 border-none text-white text-sm shadow-sm hover:bg-blue-600"
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive code?</p>
                      <button
                        className={`flex flex-row items-center ${isResendEnabled ? "text-blue-600" : "text-gray-400 cursor-not-allowed"}`}
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
