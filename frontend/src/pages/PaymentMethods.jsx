import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, BadgeIndianRupee } from "lucide-react";
import { API } from "../utils/videoHelpers";
import logo from "../assets/multiclout-logo.png";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PaymentMethods() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const selectedPlan = location.state?.selectedPlan || null;

  // Course checkout data
  const checkoutType = location.state?.checkoutType || "";
  const cartItems = location.state?.cartItems || [];
  const totalAmount = Number(location.state?.totalAmount || 0);
  const isCourseCheckout = checkoutType === "course";

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  const priceLabel = useMemo(() => {
    if (isCourseCheckout) return `₹${totalAmount.toLocaleString()}`;
    return selectedPlan?.price || "₹0";
  }, [isCourseCheckout, selectedPlan, totalAmount]);

  const handleCourseOrder = async () => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!cartItems.length) {
      alert("Cart is empty");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          paymentMethod: "demo-online",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.removeItem("multiclout_cart");
        alert("Order placed successfully");
        navigate("/account");
      } else {
        alert(data.message || "Order failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionPayment = async () => {
    if (!selectedPlan?.key) {
      alert("No plan selected");
      navigate("/mobile-subscription");
      return;
    }

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Unable to load payment gateway");
        return;
      }

      const orderRes = await fetch(`${API}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planKey: selectedPlan.key,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        alert(orderData.message || "Failed to create payment order");
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Multiclout",
        description: orderData.planTitle || "Subscription Payment",
        image: window.location.origin + logo,
        order_id: orderData.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                planKey: selectedPlan.key,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              localStorage.setItem("user", JSON.stringify(verifyData.user));
              alert("Payment successful");
              navigate("/account/subscription");
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: orderData.user?.name || "",
          email: orderData.user?.email || "",
          contact: orderData.user?.phone || "",
        },

        theme: {
          color: "#06b6d4",
        },

        modal: {
          ondismiss: async function () {
            try {
              await fetch(`${API}/payments/fail`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  planKey: selectedPlan.key,
                  reason: "Payment popup closed",
                }),
              });
            } catch (error) {
              console.error("Fail status update error:", error);
            }
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (isCourseCheckout) {
      await handleCourseOrder();
      return;
    }

    await handleSubscriptionPayment();
  };

  if (!selectedPlan && !isCourseCheckout) {
    return (
      <div className="min-h-screen bg-[#07111a] px-4 py-10 text-white">
        <div className="mx-auto max-w-md rounded-[24px] border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-lg font-semibold">No plan selected</p>
          <button
            onClick={() => navigate("/mobile-subscription")}
            className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto max-w-md px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="rounded-[30px] border border-cyan-400/10 bg-[#0b1622]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="mb-5 text-center">
            <img src={logo} alt="Multiclout" className="mx-auto h-10 w-auto" />

            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
              Secure Payment
            </p>

            <h1 className="mt-2 text-[24px] font-bold">
              Complete your purchase
            </h1>
          </div>

          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {isCourseCheckout ? "Course Purchase" : selectedPlan.title}
                </h2>

                <p className="mt-1 text-sm text-white/65">
                  {isCourseCheckout
                    ? `${cartItems.length} course${
                        cartItems.length !== 1 ? "s" : ""
                      } selected`
                    : selectedPlan.subtitle}
                </p>
              </div>

              {!isCourseCheckout && selectedPlan?.badge ? (
                <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                  {selectedPlan.badge}
                </span>
              ) : null}
            </div>

            {isCourseCheckout && cartItems.length > 0 ? (
              <div className="mt-4 max-h-44 space-y-2 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3 py-2"
                  >
                    <p className="line-clamp-1 text-sm text-white/80">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-sm font-semibold text-cyan-200">
                      ₹{Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex items-end gap-2">
              <BadgeIndianRupee size={22} className="text-cyan-300" />

              <span className="text-3xl font-bold">
                {priceLabel.replace("₹", "")}
              </span>

              {!isCourseCheckout && selectedPlan?.oldPrice ? (
                <span className="pb-1 text-sm text-white/35 line-through">
                  {selectedPlan.oldPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck size={16} className="text-cyan-300" />
              {isCourseCheckout
                ? "Your course order will be saved after payment."
                : "UPI, Cards, Netbanking and Wallets via Razorpay"}
            </div>
          </div>

          <button
            onClick={handlePayNow}
            disabled={loading}
            className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : isCourseCheckout
              ? "Pay & Place Order"
              : "Pay Now"}
          </button>

          <button
            onClick={() => navigate("/payment-transfer-terms-and-conditions")}
            className="mt-3 w-full text-sm text-cyan-300"
          >
            View Payment Transfer Terms
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethods;