import { motion } from "framer-motion";

const HeroButtonsSection = () => {
  const buttons = [
  {
    label: "MEMBER LOGIN",
    url: "https://multiclout.com/portal/user/resource_login.html",
  },
  {
    label: "REGISTRATION",
    url: "https://multiclout.com/portal/welcome/registration.html",
  },
  {
    label: "STUDENT LOGIN",
    url: "/login",
  },
];
  return (
    <section className="w-full bg-[#f8fbfc] px-4 py-12 md:py-14">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 md:gap-12">
        {buttons.map((btn) => (
          <motion.a
            key={btn.label}
            href={btn.url}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
           className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#0f8c92] via-[#13b8c6] to-[#10c990] px-8 py-4 text-[15px] font-extrabold tracking-wide text-black md:!text-white shadow-[0_12px_26px_rgba(15,140,146,0.22)] transition hover:shadow-[0_16px_34px_rgba(15,140,146,0.32)] sm:min-w-[235px]"
          >
            {btn.label}
            <span className="ml-2 text-xl leading-none">→</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default HeroButtonsSection;