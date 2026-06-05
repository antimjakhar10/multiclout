import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../utils/api";

function OtpRegistrationForm({
  mode = "register",
  initialPhone = "",
  compact = false,
  onHeroVerified = null,
}) {
  const navigate = useNavigate();

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setPhone(initialPhone || "");
  }, [initialPhone]);

  useEffect(() => {
    const checkVerifiedPhone = async () => {
      if (mode !== "register" || !initialPhone) return;

      try {
        const res = await axios.get(`${API}/otp/status`, {
          params: { mobile: initialPhone, purpose: "register" },
        });

        if (res.data.success && res.data.verified) {
          setPhone(initialPhone);
          setOtpSent(true);
          setOtpVerified(true);
          setMessage(
            "Phone already verified. Complete your registration below.",
          );
        }
      } catch (error) {
        console.error("OTP status check failed:", error);
      }
    };

    checkVerifiedPhone();
  }, [initialPhone, mode]);

  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const sendOtp = async () => {
    if (phone.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API}/otp/send`, {
        mobile: phone,
        purpose: "register",
      });

      if (res.data.success) {
        setOtpSent(true);
        setOtp("");
        setOtpVerified(false);
        setCountdown(60);
        setMessage(
          res.data.demoOtp
            ? `Your OTP: ${res.data.demoOtp}`
            : res.data.message || "OTP sent successfully.",
        );
      } else {
        setMessage(res.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Something went wrong while sending OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API}/otp/verify`, {
        mobile: phone,
        otp,
        purpose: "register",
      });

      if (res.data.success) {
        setOtpVerified(true);
        setMessage(res.data.message || "OTP verified successfully.");
        sessionStorage.setItem("verifiedRegisterPhone", phone);

        if (mode === "hero") {
          if (typeof onHeroVerified === "function") {
            onHeroVerified(phone);
          } else {
            navigate("/register");
          }
        }
      } else {
        setMessage(res.data.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Something went wrong while verifying OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    if (!otpVerified) {
      setMessage("Please verify OTP first.");
      return;
    }

    if (!form.name.trim() || !form.password.trim()) {
      setMessage("Name and password are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API}/auth/register`, {
        name: form.name,
        email: form.email,
        phone,
        password: form.password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.removeItem("verifiedRegisterPhone");
        navigate("/mobile-subscription");
      } else {
        setMessage(res.data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Something went wrong while registering.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${compact ? "max-w-[640px]" : "max-w-[540px]"}`}>
      <div className="rounded-[26px] border border-white/10 bg-black/20 p-5 sm:p-6">
        {!otpVerified && (
          <>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Mobile Number
            </label>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter your mobile number"
              className="h-[54px] w-full rounded-[16px] border border-white/10 bg-white/95 px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
            />

            {!otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="mt-4 inline-flex h-[52px] w-full items-center justify-center rounded-[16px] bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {otpSent && !otpVerified && (
              <>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="h-[54px] w-full rounded-[16px] border border-white/10 bg-white/95 px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="mt-4 inline-flex h-[52px] w-full items-center justify-center rounded-[16px] bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-300">
                  <span>
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Didn’t receive OTP?"}
                  </span>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={countdown > 0 || loading}
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {otpVerified && (
          <div className="space-y-4">
            <div className="rounded-[18px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300">
              Verified mobile number: +91 {phone}
            </div>

            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="h-[54px] w-full rounded-[16px] border border-white/10 bg-white/95 px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="h-[54px] w-full rounded-[16px] border border-white/10 bg-white/95 px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
            />

            <input
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="h-[54px] w-full rounded-[16px] border border-white/10 bg-white/95 px-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={registerUser}
              disabled={loading}
              className="inline-flex h-[54px] w-full items-center justify-center rounded-[16px] bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(16,185,129,0.22)] transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        )}

        {message ? (
          <p
            className={`mt-4 text-center font-bold tracking-wide ${
              message.includes("Your OTP")
                ? "text-[18px] text-[#ff9d9d]"
                : otpVerified || message.toLowerCase().includes("success")
                  ? "text-sm text-emerald-300"
                  : "text-sm text-red-300"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default OtpRegistrationForm;
