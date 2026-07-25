import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const analytics = useFetch("/api/analytics");
  const sessionsReq = useFetch("/api/sessions");

  const stats = analytics.data;
  const sessions = sessionsReq.data?.sessions || [];

  async function handleDelete(id) {
    if (!confirm("Delete this session? This can't be undone.")) return;
    try {
      await api.del(`/api/sessions/${id}`);
      sessionsReq.refetch(); // reload the list
      analytics.refetch();   // stats may change too
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">NipunAI</h1>
            <p className="text-muted">Welcome back, {user?.name} 👋</p>
          </div>
          <button onClick={logout} className="neu-btn px-5 py-2 text-sm font-medium">
            Log out
          </button>
        </div>

        {/* Analytics cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Avg score" value={stats?.avgScore ?? "—"} />
          <StatCard label="Best score" value={stats?.bestScore ?? "—"} />
          <StatCard label="Answered" value={stats?.totalAnswered ?? 0} />
          <StatCard label="Completion" value={stats ? `${stats.completionRate}%` : "—"} />
        </div>

        {/* Section header + CTA */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Your sessions</h2>
          <Link
            to="/sessions/new"
            className="neu-btn-primary px-6 py-2 text-sm font-medium"
          >
            + New session
          </Link>
        </div>

        {/* Session list */}
        <div className="mt-4 space-y-3">
          {sessionsReq.loading && <p className="text-muted">Loading…</p>}

          {!sessionsReq.loading && sessions.length === 0 && (
            <div className="neu p-8 text-center text-muted">
              No sessions yet — start your first interview!
            </div>
          )}

          {sessions.map((s) => (
            <div key={s._id} className="neu flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-ink">{s.jobTitle}</p>
                <p className="text-sm text-muted">{s.company || "—"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="neu-inset px-3 py-1 text-xs text-navy">{s.status}</span>
                  <span className="text-xs text-muted">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {s.status === "completed" ? (
                  <Link
                    to={`/sessions/${s._id}/report`}
                    className="neu-btn px-4 py-2 text-sm font-medium"
                  >
                    Report
                  </Link>
                ) : (
                  <Link
                    to={`/sessions/${s._id}`}
                    className="neu-btn px-4 py-2 text-sm font-medium"
                  >
                    Open
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(s._id)}
                  className="neu-btn px-3 py-2 text-sm text-red-500"
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="neu p-5 text-center">
      <p className="text-3xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}