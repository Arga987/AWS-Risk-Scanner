import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "./context/useTheme";
import { Button } from "@base-ui/react";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-green-500/10 text-green-500"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
    }`;

  return (
    <nav className="relative z-50 flex h-18 items-center justify-between bg-white px-3 shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:bg-[rgb(34,34,33)] sm:px-6 md:justify-start md:px-8">
      {/* Logo and title */}
      <NavLink
        to="/"
        onClick={() => setMenuOpen(false)}
        aria-label="AWS Security Scanner Home"
        className="relative z-50 flex min-w-0 items-center gap-2 md:gap-3"
      >
        <img src="/Logo.png" alt="" className="h-8 w-auto shrink-0 md:h-11" />

        <span className="whitespace-nowrap text-[11px] font-semibold tracking-tight text-gray-900 dark:text-white sm:text-sm md:text-lg">
          AWS SECURITY SCANNER
        </span>
      </NavLink>

      {/* Desktop navigation */}
      <div className="ml-32 hidden h-full md:flex">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex h-full items-center px-16 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-green-500/10 dark:hover:text-white"
            }`
          }
        >
          HOME
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex h-full items-center px-16 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-green-500/10 dark:hover:text-white"
            }`
          }
        >
          HISTORY
        </NavLink>
      </div>

      {/* Theme toggle and mobile menu button */}
      <div className="relative z-50 ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </TooltipTrigger>

          <TooltipContent>
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </TooltipContent>
        </Tooltip>

        <Button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>

      {/* Mobile backdrop and navigation card */}
      {menuOpen && (
        <>
          <Button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[60] cursor-default border-0 bg-black/30 backdrop-blur-sm md:hidden"
          />

          <div
            id="mobile-navigation"
            className="fixed right-3 top-20 z-[70] flex w-64 max-w-[calc(100vw-1.5rem)] flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#202426] md:hidden"
          >
            <span className="mb-1 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Navigation
            </span>

            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/history"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              History
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
