import { motion } from "framer-motion";
import { FaGooglePlay } from "react-icons/fa";

const HeroButtonsSection = () => {
  const buttons = [
  {
    label: "NEW MEMBER LOGIN",
    url: "https://multiclout.com/portal/user/resource_login.html",
  },
  {
    label: "NEW REGISTRATION",
    url: "https://multiclout.com/portal/welcome/registration.html",
  },
  {
    label: "STUDENT LOGIN",
    url: "/login",
  },
  {
    label: "GOOGLE PLAY",
    url: "#", // Google Play Link
  },
];
  return (
    <section className="w-full bg-[#f8fbfc] px-4 py-12 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 md:gap-10">
        {buttons.map((btn) => (
          <motion.a
          
            key={btn.label}
            href={btn.url}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          className={`inline-flex min-w-[200px] items-center justify-center rounded-2xl px-6 py-4 text-[15px] font-extrabold tracking-wide transition shadow-[0_12px_26px_rgba(15,140,146,0.22)] hover:shadow-[0_16px_34px_rgba(15,140,146,0.32)] sm:min-w-[220px]
${
  btn.label === "GOOGLE PLAY"
  ? "bg-[#0B1F33] border border-[#18c7b6] !text-white hover:bg-[#12304d]"
    : "bg-gradient-to-r from-[#0f8c92] via-[#13b8c6] to-[#10c990] text-black md:text-white"
}`}
          >
            {btn.label === "GOOGLE PLAY" && (
  <FaGooglePlay className="mr-2 text-lg" />
)}

{btn.label}

<span className="ml-2 text-xl leading-none">→</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default HeroButtonsSection;