import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useCart();

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    navigate("/payment-methods", {
      state: {
        checkoutType: "course",
        cartItems,
        totalAmount,
      },
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f7fafc] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[30px] border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>

          <div className="mt-6 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between rounded-2xl bg-slate-50 p-4"
              >
                <span className="font-semibold text-slate-800">{item.title}</span>
                <span className="font-bold text-[#163462]">
                  ₹{Number(item.price || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <span className="text-xl font-bold">Total</span>
            <span className="text-3xl font-extrabold text-[#163462]">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-7 w-full rounded-2xl bg-[#163462] px-5 py-4 text-lg font-semibold text-white"
          >
            Place Order & Pay
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;