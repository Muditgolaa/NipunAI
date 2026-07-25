import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();       // stop the browser's default form reload
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard"); // programmatic redirect on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="neu w-full max-w-md p-8">
        <div className="flex justify-center mb-4">
          <Logo size={52} />
        </div>
        <h1 className="text-3xl font-bold text-navy text-center">Welcome back</h1>
        <p className="mt-1 text-center text-muted">Log in to NipunAI</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="neu-input w-full px-5 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="neu-input w-full px-5 py-3"
          />

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="neu-btn-primary w-full py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link to="/register" className="font-semibold text-navy hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}