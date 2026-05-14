import { useEffect, useState } from "react";
import {
  Headphones,
  Phone,
  Mail,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/videoHelpers";

function ContactCard({ icon: Icon, label, value, tone = "cyan" }) {
  const toneStyles = {
    cyan: "text-cyan-300",
    emerald: "text-emerald-300",
    yellow: "text-yellow-300",
    purple: "text-purple-300",
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] ${toneStyles[tone]}`}
      >
        <Icon size={18} />
      </div>

      <p className="mt-4 text-sm text-white/55">{label}</p>
      <h3 className="mt-1 break-words text-base font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}

function UserHelpSupport() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API}/site-settings`);
        const result = await res.json();

        if (res.ok && result.success) {
          setData(result.settings?.contactPage || null);
        }
      } catch (error) {
        console.error("Failed to fetch support settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const supportPoints =
    (data?.supportPoints || []).slice(0, 3).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
          Help & Support
        </p>

        <h2 className="mt-3 text-[28px] font-bold leading-[1.12] text-white sm:text-[34px]">
          Need help with your account?
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
  Get official support details and quick help options for your account,
  subscriptions, and payments.
</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ContactCard
          icon={Phone}
          label={data?.callLabel || "Call"}
          value={data?.callValue || "+91 99999 99999"}
          tone="cyan"
        />

        <ContactCard
          icon={Mail}
          label={data?.emailLabel || "Email"}
          value={data?.emailValue || "support@multiclout.com"}
          tone="emerald"
        />

        <ContactCard
          icon={Building2}
          label={data?.companyTitle || "Company"}
          value={data?.companyName || "Multiclout"}
          tone="purple"
        />

        <ContactCard
          icon={MapPin}
          label="Address"
          value={data?.companyAddress || "India"}
          tone="yellow"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-300">
            <Headphones size={18} />
          </div>

          <h3 className="mt-4 text-xl font-bold text-white">
            Support guidance
          </h3>

          <div className="mt-4 space-y-3">
            {supportPoints.length > 0 ? (
              supportPoints.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/58">
                    {item.subtitle}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">
                    Account related help
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/58">
  Use the official support details for login, access, and profile issues.
</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">
                    Subscription queries
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/58">
  Contact support for plan, premium access, or payment-related queries.
</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">
                    General support
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/58">
  Official channels are available for business plan and platform usage support.
</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold text-white">Quick actions</h3>
          <p className="mt-3 text-sm leading-7 text-white/60">
  Use these shortcuts to manage your plan, access, or support requests.
</p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={() => navigate("/account/subscription")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Open Subscription
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.07]"
            >
              Open Contact Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHelpSupport;