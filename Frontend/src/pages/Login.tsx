import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Moon, Sun, ShieldCheck } from "lucide-react";
import axiosInstance from "@/util/axiosInstance";
import api from "@/API";
import { useTheme } from "@/components/context/useTheme";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await axiosInstance.post(api.AUTH.LOGIN, {
        username,
        password,
      });

      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage(
          "Unable to log in. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-[#0a0e0f]">
      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login card */}
      <section className="w-full max-w-md rounded-xl border border-slate-200 border-l-4 border-l-green-500 bg-white p-7 shadow-sm sm:p-9 dark:border-white/20 dark:border-l-green-500 dark:bg-[#202426] dark:shadow-none">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/Logo.png"
            alt="AWS Security Scanner"
            className="mb-4 h-16 w-auto"
          />

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AWS SECURITY SCANNER
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              disabled={isLoading}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60 dark:border-white/20 dark:bg-[#171b1d] dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:opacity-60 dark:border-white/20 dark:bg-[#171b1d] dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized access only
        </p>
      </section>
    </main>
  );
};

export default Login;
