import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07111a] py-14">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d7084] via-[#4d9a97] to-[#7bc0b0]">
                <span className="text-lg font-bold text-white">M</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">Multiclout</h2>
                <p className="text-xs tracking-[0.18em] text-white/55">
                  LEARN • BUILD • GROW
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-[320px] text-sm leading-7 text-slate-400">
              A modern platform for courses, videos, tutorials, mentors and
              growth-driven learning in one clean experience.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/watch-videos" className="transition hover:text-white">
                  Watch Videos
                </Link>
              </li>
              <li>
                <Link to="/business-plan" className="transition hover:text-white">
                  Business Plan
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="transition hover:text-white">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/blog" className="transition hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="transition hover:text-white">
                  Franchise
                </Link>
              </li>
              <li className="transition hover:text-white">About Us</li>
              <li className="transition hover:text-white">Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="transition hover:text-white">FAQs</li>
              <li className="transition hover:text-white">Privacy Policy</li>
              <li className="transition hover:text-white">Terms & Conditions</li>
              <li className="transition hover:text-white">Help Center</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-sm text-slate-500">
          © 2026 Multiclout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;