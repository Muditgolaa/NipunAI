import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">NipunAI</h1>
        <button onClick={logout} className="neu-btn px-5 py-2 text-sm font-medium">
          Log out
        </button>
      </div>

      <div className="neu mt-8 max-w-2xl p-8">
        <h2 className="text-xl font-semibold text-navy">Welcome, {user?.name} 👋</h2>
        <p className="mt-2 text-muted">Ready to practice? Start a new interview session.</p>
        <Link
          to="/sessions/new"
          className="neu-btn-primary mt-6 inline-block px-8 py-3 font-medium"
        >
          + New session
        </Link>
      </div>
    </div>
  );
}