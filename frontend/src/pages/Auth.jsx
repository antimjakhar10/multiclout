import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../utils/videoHelpers";
import logo from "../assets/multiclout-logo.png";

function Auth() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStatusText("");

      const res = await fetch(`${API}/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phone.trim(),
          purpose: "access",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || "Failed to send OTP");
        return;
      }

      setStep("otp");
      setStatusText(
        result.demoOtp
          ? `Your OTP: ${result.demoOtp}`
          : result.message || "OTP sent successfully",
      );
      startCountdown();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStatusText("");

      const verifyRes = await fetch(`${API}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phone.trim(),
          otp: otp.trim(),
          purpose: "access",
        }),
      });

      const verifyResult = await verifyRes.json();

      if (!verifyRes.ok || !verifyResult.success) {
        setError(verifyResult.message || "Invalid OTP");
        return;
      }

      const accessRes = await fetch(`${API}/auth/otp-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.trim(),
        }),
      });

      const accessResult = await accessRes.json();

      if (!accessRes.ok || !accessResult.success) {
        setError(accessResult.message || "Authentication failed");
        return;
      }

      if (accessResult.needsRegistration) {
        sessionStorage.setItem("verifiedRegisterPhone", phone.trim());
        navigate("/register");
        return;
      }

      if (accessResult.token) {
        localStorage.setItem("token", accessResult.token);
        localStorage.setItem("userToken", accessResult.token);
      }

      if (accessResult.user) {
        localStorage.setItem("user", JSON.stringify(accessResult.user));
      }

      if (accessResult.needsOnboarding) {
        navigate("/mobile-subscription");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(77,154,151,0.18),transparent_28%),linear-gradient(180deg,#07111a_0%,#0b1b2b_45%,#10263a_100%)] text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
            <div className="mb-7 text-center">
              <img
                src={logo}
                alt="Multiclout"
                className="mx-auto h-11 w-auto object-contain"
              />

              <p className="mt-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Quick Access
              </p>

              <h1 className="mt-4 text-[30px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[34px]">
                Continue with your
                <span className="mt-1 block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  mobile number
                </span>
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Login with OTP and continue your mobile app flow.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5">
              {step === "phone" && (
                <>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="Enter mobile number"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-[16px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
                  />

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-[16px] font-semibold text-white shadow-[0_16px_40px_rgba(16,185,129,0.24)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter OTP"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white px-4 text-[16px] text-[#0f172a] outline-none placeholder:text-slate-400 focus:border-cyan-400"
                  />

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="mt-4 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-[16px] font-semibold text-white shadow-[0_16px_40px_rgba(16,185,129,0.24)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-300">
                    <span>
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Didn’t receive OTP?"}
                    </span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={countdown > 0 || loading}
                      className="font-semibold text-cyan-300 transition hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                      setError("");
                      setStatusText("");
                    }}
                    className="mt-3 w-full text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Change number
                  </button>
                </>
              )}

              {statusText ? (
                <p
                  className={`mt-4 text-center font-bold tracking-wide ${
                    statusText.includes("Your OTP")
                      ? "text-[18px] text-[#ff9d9d]"
                      : "text-sm text-emerald-300"
                  }`}
                >
                  {statusText}
                </p>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="mt-5 border-t border-white/10 pt-4 text-center text-sm text-white/65">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
