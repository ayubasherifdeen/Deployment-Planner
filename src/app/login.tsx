import { useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase"

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
    body, * { font-family: 'IBM Plex Mono', 'Courier New', monospace !important; }
    .font-display { font-family: 'Syne', sans-serif !important; }
  `}</style>
);

export default function LoginPage() {
  const { login  }   = useAuth();
  const navigate    = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [showReset, setShowReset]       = useState(false);
  const [resetEmail, setResetEmail]     = useState("");
  const [resetStatus, setResetStatus]   = useState<"idle"|"success"|"error">("idle");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //login
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.role ==="admin" ? "/app/adminDashboard" : "/app/personnelDashboard");

    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/invalid-credential":   "Invalid email or password",
        "auth/user-not-found":       "No account found with that email",
        "auth/wrong-password":       "Incorrect password",
        "auth/too-many-requests":    "Too many attempts. Try again later",
        "auth/invalid-email":        "Please enter a valid email address",
      };
      setError(messages[err.code] ?? err.message);
    } finally {
      
      setLoading(false);
    }
  };

   const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetStatus("idle");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus("success");
      setResetMessage(
        `If an account exists for ${resetEmail}, a reset link has been sent. Check your inbox.`
      );
      setResetEmail("");
    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/invalid-email":     "Please enter a valid email address",
        "auth/too-many-requests": "Too many attempts. Try again later",
      };
      setResetStatus("error");
      setResetMessage(messages[err.code] ?? "Something went wrong. Try again.");
    } finally {
      setResetLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
  <FontStyle />

  <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

    {!showReset ? (
      <>
        {/* Title */}
        <h1 className="mb-1 text-lg font-bold text-gray-900">
          Deployment Planner
        </h1>
        <p className="mb-5 text-xs text-gray-500">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="on"
              placeholder="you@deployforce.com"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="on"
              placeholder="******"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Forgot */}
          <button
            type="button"
            onClick={() => {
              setShowReset(true);
              setResetEmail(email);
              setError("");
            }}
            className="text-center text-[15px] text-indigo-600 hover:underline"
          >
            Forgot your password?
          </button>
        </form>
      </>
    ) : (
      <>
        {/* Back */}
        <button
          onClick={() => {
            setShowReset(false);
            setResetStatus("idle");
            setResetMessage("");
          }}
          className="mb-3 flex items-center gap-1 text-[15px] font-semibold text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to login
        </button>

        {/* Title */}
        <h1 className="mb-1 text-lg font-bold text-gray-900">
          Reset Password
        </h1>
        <p className="mb-5 text-xs text-gray-500">
          Enter your email to receive a reset link
        </p>

        {resetStatus === "success" ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
              {resetMessage}
            </div>

            <button
              onClick={() => {
                setShowReset(false);
                setResetStatus("idle");
                setResetMessage("");
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            
            <div>
              <label
                htmlFor="resetEmail"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500"
              >
                Email
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="you@deployforce.com"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {resetStatus === "error" && (
              <p className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                {resetMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </>
    )}
  </div>
</div>
)
}

  


