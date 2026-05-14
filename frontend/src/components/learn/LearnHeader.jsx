import { UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/multiclout-logo.png";

function LearnHeader({ user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08111f]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Multiclout"
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <Link
          to={user ? "/profile" : "/login"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90"
        >
          <UserCircle2 size={20} />
        </Link>
      </div>
    </header>
  );
}

export default LearnHeader;