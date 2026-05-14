import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";
import { FaGooglePlay, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/multiclout-logo.png";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07111a] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-12 lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.55fr] xl:gap-8">
          {/* LEFT SECTION */}
          <div className="max-w-[360px]">
            <img
              src={logo}
              alt="Multiclout"
              className="h-14 w-auto object-contain"
            />

            <p className="mt-5 text-[15px] leading-8 text-slate-400">
              Learn faster with curated videos, courses, mentors, and practical
              business knowledge in one clean platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex min-w-[168px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
              >
                <FaGooglePlay className="text-base" />
                Google Play
              </a>
            </div>

            <div className="mt-8">
              <h4 className="text-[18px] font-semibold text-white">
                Follow Us
              </h4>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.instagram.com/multicloutofficial"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://www.youtube.com/@multicloutservices"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FaYoutube />
                </a>

                <a
                  href="https://www.facebook.com/multicloutservices"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://x.com/multiclout"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FaXTwitter />
                </a>

                <a
                  href="https://in.pinterest.com/multicloutservices/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FaPinterestP />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:gap-8">
            {/* LEFT SIDE OF RIGHT SECTION */}
            <div>
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
                {/* QUICK LINKS */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white">
                    Quick Links
                  </h3>
                  <div className="mt-3 h-[2px] w-12 rounded-full bg-[#5fc7d3]" />

                  <ul className="mt-5 space-y-4 text-[15px] text-slate-400">
                    <li>
                      <Link to="/" className="transition hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/watch-videos"
                        className="transition hover:text-white"
                      >
                        Watch Videos
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/business-plan"
                        className="transition hover:text-white"
                      >
                        Business Plan
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tutorials"
                        className="transition hover:text-white"
                      >
                        Tutorials
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* COMPANY */}
                <div>
                  <h3 className="text-[18px] font-semibold text-white">
                    Company
                  </h3>
                  <div className="mt-3 h-[2px] w-12 rounded-full bg-[#5fc7d3]" />

                  <ul className="mt-5 space-y-4 text-[15px] text-slate-400">
                    <li>
                      <Link to="/blog" className="transition hover:text-white">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/franchise"
                        className="transition hover:text-white"
                      >
                        Franchise
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="transition hover:text-white">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="transition hover:text-white"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* PHONE + ADDRESS UNDER FIRST 2 COLUMNS */}
              <div className="mt-10 border-t border-white/10 pt-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-[#5fc7d3]">
                      <FaPhoneAlt />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        Phone
                      </p>
                      <a
                        href="tel:+917206123452"
                        className="mt-1 block text-[15px] text-slate-400 transition hover:text-white"
                      >
                        +91-7206123452
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-[#5fc7d3]">
                      <FaMapMarkerAlt />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        Address
                      </p>
                      <p className="mt-1 max-w-[420px] text-[15px] leading-7 text-slate-400">
                        Office No : 466 - Dwarka Sector 7, Delhi - 110075
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT */}
            <div className="xl:pl-2">
              <h3 className="text-[18px] font-semibold text-white">Support</h3>
              <div className="mt-3 h-[2px] w-12 rounded-full bg-[#5fc7d3]" />

              <ul className="mt-5 space-y-4 text-[15px] text-slate-400">
                <li>
                  <a href="/#faq" className="transition hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
  <Link to="/become-a-member" className="transition hover:text-white">
    Become a Member
  </Link>
</li>
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="transition hover:text-white"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/end-user-license-agreement"
                    className="transition hover:text-white"
                  >
                    End User License Agreement
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="transition hover:text-white"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="transition hover:text-white"
                  >
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/payment-transfer-terms-and-conditions"
                    className="transition hover:text-white"
                  >
                    Payment Transfer Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Multiclout Services Pvt Limited. All rights reserved.</p>
            <p>Built for learning, business growth, and practical skills.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
