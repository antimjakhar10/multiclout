import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingBag,
  FiShield,
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { API } from "../utils/api";
import { getImageUrl } from "../utils/videoHelpers";
import logo from "../assets/multiclout-logo.png";
import MobileBottomNav from "../components/videos/MobileBottomNav";
import MobileAppHeader from "../components/videos/MobileAppHeader";

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

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, totalAmount, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const token =
    localStorage.getItem("userToken") || localStorage.getItem("token");

  const pageBg =
    "bg-[var(--mc-bg-main)] text-[var(--mc-text-main)] md:bg-[#f6f8fb] md:text-slate-900";
  const cardBg =
    "border border-[var(--mc-border)] bg-[var(--mc-bg-card)] text-[var(--mc-text-main)] md:border-slate-200 md:bg-white md:text-slate-900";
  const headingText = "text-[var(--mc-text-main)] md:text-slate-950";
  const mutedText = "text-[var(--mc-text-soft)] md:text-slate-500";
  const borderSoft = "border-[var(--mc-border)] md:border-slate-100";

  const handlePayAndPlaceOrder = async () => {
    if (!cartItems.length) {
      alert("Cart is empty");
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

      const orderRes = await fetch(`${API}/payments/course/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
  console.error("Course order create failed:", orderData);
  alert(orderData.error || orderData.message || "Failed to create payment order");
  return;
}

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Multiclout",
        description: "Course Purchase",
        image: window.location.origin + logo,
        order_id: orderData.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API}/payments/course/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: cartItems,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              alert("Payment successful. Course purchased!");
              navigate("/account/my-courses");
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: orderData.user?.name || "",
          email: orderData.user?.email || "",
          contact: orderData.user?.phone || "",
        },

        theme: {
          color: "#163462",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <MobileAppHeader />
      </div>

      <main
        className={`min-h-screen px-4 pb-24 pt-6 sm:px-6 md:pb-8 md:pt-8 lg:px-8 ${pageBg}`}
      >
        <div className="mx-auto max-w-[1250px]">
          <button
            onClick={() => navigate(-1)}
            className={`mb-5 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#163462] ${mutedText}`}
          >
            <FiArrowLeft />
            Continue learning
          </button>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#13b7dc] md:text-[#2d7084]">
                Secure Checkout
              </p>

              <h1 className={`mt-2 text-[28px] font-extrabold sm:text-[42px] ${headingText}`}>
                Shopping Cart
              </h1>

              <p className={`mt-2 text-sm sm:text-base ${mutedText}`}>
                {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in
                your cart
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--mc-text-main)] md:border-emerald-100 md:bg-emerald-50 md:text-emerald-700">
              <FiShield />
              Safe & secure payment
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className={`rounded-[26px] px-6 py-14 text-center shadow-sm md:rounded-[30px] ${cardBg}`}>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--mc-chip-bg)] text-[var(--mc-text-soft)] md:bg-slate-100 md:text-slate-400">
                <FiShoppingBag className="text-4xl" />
              </div>

              <h2 className={`mt-5 text-2xl font-bold ${headingText}`}>
                Your cart is empty
              </h2>

              <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${mutedText}`}>
                Courses add karo, fir yahin se direct payment aur order place ho
                jayega.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-7 rounded-full bg-[#163462] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#102a52]"
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              <section className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className={`overflow-hidden rounded-[24px] shadow-sm transition hover:shadow-md md:rounded-[26px] ${cardBg}`}
                  >
                    <div className="flex flex-col gap-4 p-4 sm:flex-row">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-[180px] w-full rounded-[20px] object-cover sm:h-[135px] sm:w-[190px]"
                      />

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#13b7dc] md:text-[#2d7084]">
                            {item.category || "Premium Course"}
                          </p>

                          <h3 className={`line-clamp-2 text-lg font-extrabold leading-snug ${headingText}`}>
                            {item.title}
                          </h3>

                          <p className={`mt-2 text-sm ${mutedText}`}>
                            By {item.instructor || "Expert Instructor"}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <FiTrash2 />
                          Remove
                        </button>
                      </div>

                      <div className={`flex items-center justify-between border-t pt-4 sm:block sm:border-t-0 sm:pt-0 sm:text-right ${borderSoft}`}>
                        <p className="text-xs font-semibold uppercase text-[var(--mc-text-soft)] sm:mb-2 md:text-slate-400">
                          Price
                        </p>

                        <p className="text-2xl font-extrabold text-[#13b7dc] md:text-[#163462]">
                          ₹{Number(item.price || 0).toLocaleString()}
                        </p>

                        {Number(item.oldPrice) > 0 ? (
                          <p className="mt-1 text-sm text-[var(--mc-text-soft)] line-through md:text-slate-400">
                            ₹{Number(item.oldPrice).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <aside className={`h-fit rounded-[26px] p-5 shadow-sm md:rounded-[30px] lg:sticky lg:top-24 ${cardBg}`}>
                <h2 className={`text-xl font-extrabold ${headingText}`}>
                  Order Summary
                </h2>

                <div className={`mt-5 space-y-3 border-b pb-5 ${borderSoft}`}>
                  <div className={`flex justify-between text-sm ${mutedText}`}>
                    <span>Courses</span>
                    <span>{cartItems.length}</span>
                  </div>

                  <div className={`flex justify-between text-sm ${mutedText}`}>
                    <span>Subtotal</span>
                    <span>₹{Number(totalAmount || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm text-emerald-500 md:text-emerald-600">
                    <span>Platform fee</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <span className="text-base font-bold text-[var(--mc-text-soft)] md:text-slate-700">
                    Total
                  </span>

                  <span className="text-4xl font-black text-[#13b7dc] md:text-[#163462]">
                    ₹{Number(totalAmount || 0).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handlePayAndPlaceOrder}
                  disabled={loading}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#163462] to-[#2d7084] text-base font-bold text-white shadow-[0_14px_28px_rgba(22,52,98,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiLock />
                  {loading ? "Starting Payment..." : "Pay & Place Order"}
                </button>

                <div className="mt-5 rounded-[22px] border border-[var(--mc-border)] bg-[var(--mc-chip-bg)] p-4 md:border-slate-200 md:bg-slate-50">
                  <div className="flex gap-3">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-[#13b7dc] md:text-[#2d7084]" />
                    <p className={`text-sm leading-6 ${mutedText}`}>
                      After successful payment, the course will be automatically saved to your account.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-[var(--mc-text-soft)] md:text-slate-400">
                  By placing order, you agree to Multiclout payment terms.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}

export default Cart;