import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "./context/useTheme";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav
      className="relative z-10 flex h-18 items-center px-8 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:bg-[rgb(34,34,33)]
      "
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3">
        <img src="/Logo.png" alt="" className="h-11 w-auto" />

        <span className="text-lg font-semibold dark:text-white">
          AWS SECURITY SCANNER
        </span>
      </NavLink>

      {/* Navigation */}
      <div className="ml-32 flex h-full">
        <NavLink
          to="/"
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
      {/* Theme Toggle */}
      <div className="ml-auto">
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="
              flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100
              hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </TooltipTrigger>

          <TooltipContent>
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
};

export default Navbar;
