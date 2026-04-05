import { useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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


 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //login
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.role ==="admin" ? "/app/adminDashboard" : "/app/personnelDashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <FontStyle/>
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Deployment Planner</h1>
        <p className="mb-6 text-sm text-gray-500">Sign in to your account</p>

        <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email
           
            <input
              type="email"
              value={email}
              name="email"
              id="email"
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="on"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@deployforce.com"
            />
             </label>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Password
            
            <input
              type="password"
              value={password}
              name="password"
              id="password"
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="on"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="******"
              
            />
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
           <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
