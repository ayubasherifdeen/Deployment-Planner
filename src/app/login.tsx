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
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        {!showReset ? (
          // ── Login form ──
          <>
            <h1 className="mb-1 text-xl font-bold text-gray-900">Deployment Planner</h1>
            <p className="mb-6 text-sm text-gray-500">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                  <input
                    type="email" id="email" name="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="on"
                    placeholder="you@deployforce.com"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>

              <div>
                <label htmlFor="password"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Password
                  <input
                    type="password" id="password" name="password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    required autoComplete="on"
                    placeholder="******"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* Forgot password link */}
              <button
                type="button"
                onClick={() => {
                  setShowReset(true);
                  setResetEmail(email); // pre-fill with whatever they typed
                  setError("");
                }}
                className="text-center text-xs text-indigo-600 hover:underline"
              >
                Forgot your password?
              </button>
            </form>
          </>
        ) : (
          // ── Reset form ──
          <>
            <button
              onClick={() => {
                setShowReset(false);
                setResetStatus("idle");
                setResetMessage("");
              }}
              className="mb-4 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 19l-7-7 7-7" />
              </svg>
              Back to login
            </button>

            <h1 className="mb-1 text-xl font-bold text-gray-900">Reset Password</h1>
            <p className="mb-6 text-sm text-gray-500">
              Enter your email and we'll send you a reset link.
            </p>

            {resetStatus === "success" ? (
              // Success state — show message and back button
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  {resetMessage}
                </div>
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetStatus("idle");
                    setResetMessage("");
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="resetEmail"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                    <input
                      type="email" id="resetEmail"
                      value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                      required
                      placeholder="you@deployforce.com"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                {resetStatus === "error" && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                    {resetMessage}
                  </p>
                )}

                <button type="submit" disabled={resetLoading}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
sendPasswordResetEmail()
  


