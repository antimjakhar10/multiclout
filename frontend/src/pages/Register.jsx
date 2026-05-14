import { Link } from "react-router-dom";
import OtpRegistrationForm from "../components/auth/OtpRegistrationForm";
import logo from "../assets/multiclout-logo.png";

function Register() {
  const verifiedPhone = sessionStorage.getItem("verifiedRegisterPhone") || "";

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
                Create Account
              </p>

              <h1 className="mt-4 text-[30px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[34px]">
                Register with your
                <span className="mt-1 block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  mobile number
                </span>
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Verify OTP and complete your account setup.
              </p>
            </div>

            <OtpRegistrationForm
              mode="register"
              initialPhone={verifiedPhone}
              compact={false}
            />

            <div className="mt-5 text-center text-sm text-white/65">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;