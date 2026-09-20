import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="relative z-10 flex h-16 items-center justify-between bg-white px-8 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <Link to="/" className="text-lg font-semibold">
        AWS SECURITY SCANNER
      </Link>

      <div className="flex gap-6">
        <Link to="/" className="text-sm font-medium">
          HOME
        </Link>

        <Link to="/history" className="text-sm font-medium">
          HISTORY
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
