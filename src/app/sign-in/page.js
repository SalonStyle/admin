"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function AuthForm() {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate Indian phone number format (10 digits, optionally with +91 prefix)
  const validatePhoneNumber = (phone) => {
    const indianPhoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Format phone number to ensure it has +91 prefix
    const formattedPhone = phoneNumber.startsWith("+91")
      ? phoneNumber.replace(/\s+/g, "")
      : "+91" + phoneNumber.replace(/\s+/g, "");

    if (!validatePhoneNumber(formattedPhone)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }

    setIsLoading(true);

    try {
      // Call your API here to send OTP
      // const response = await fetch('/api/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber: formattedPhone })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (!response.ok) throw new Error('Failed to send OTP')

      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      // Call your API here to verify OTP
      // const response = await fetch('/api/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     phoneNumber: phoneNumber.startsWith("+91") ? phoneNumber : "+91" + phoneNumber,
      //     otp: otpValue
      //   })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (!response.ok) throw new Error('Invalid OTP')

      // Redirect or handle successful verification
      console.log("OTP verified successfully");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full absolute top-0 left-0 w-full flex items-center justify-center bg-gradient-to-b from-indigo-950 to-indigo-600">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-indigo-950"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            {step === "phone" ? "Log in to Your Account" : "Verify Your Number"}
          </h1>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium">
                    Mobile Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full focus-visible:ring-[2px] shadow-none focus-visible:ring-ring/10 focus-visible:ring-destructive/10"
                    required
                  />
                </div>

                {/* <div className="flex items-center">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="ml-2 text-sm">
                    Stay logged in
                  </Label>
                </div> */}

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Continue with Mobile"}
                </Button>

                {/* <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div> */}

                {/* <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Log in with Google
                </Button> */}

                {/* <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="#"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </Link>
                </div> */}
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="block text-sm font-medium">
                    Enter the 6-digit code sent to
                  </Label>
                  <p className="text-sm font-medium">
                    {phoneNumber.startsWith("+91")
                      ? phoneNumber
                      : "+91 " + phoneNumber}
                  </p>
                  <div className="flex gap-2 mt-2 justify-between ">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg focus-visible:ring-[2px] shadow-none focus-visible:ring-ring/10 focus-visible:ring-destructive/10"
                        required
                      />
                    ))}
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center text-sm">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-500"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-500"
                    onClick={() => {
                      setStep("phone");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                  >
                    Change phone number
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-white">
          <span>Terms of Service</span> and <span>Privacy Policy</span> apply.
        </div>
      </div>
    </div>
  );
}
