import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Logo from "../components/Logo";

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`/api/sessions/${id}/report`);

  if (loading) return <Centered>Loading report…</Centered>;
  if (error) return <Centered>Error: {error}</Centered>;

  const { session, items, stats } = data;

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <h1 className="text-2xl font-bold text-navy">Session report</h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="neu-btn px-5 py-2 text-sm font-medium"
          >
            Dashboard
          </button>
        </div>

        {/* Summary */}
        <div className="neu mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-ink">{session.jobTitle}</p>
            {session.company && <p className="text-muted">{session.company}</p>}
            <span className="neu-inset mt-2 inline-block px-3 py-1 text-xs text-navy">
              {session.status}
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted">Average score</p>
            <p className="text-5xl font-bold text-navy">
              {stats.avgScore ?? "—"}
              {stats.avgScore != null && <span className="text-2xl text-muted">/100</span>}
            </p>
            <p className="text-sm text-muted">
              {stats.answered} of {stats.total} answered
            </p>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="mt-8 space-y-4">
          {items.map(({ question, answer }, i) => (
            <div key={question._id} className="neu p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2 text-xs text-muted">
                  <span className="neu-inset px-3 py-1">{question.category}</span>
                  <span className="neu-inset px-3 py-1">{question.difficulty}</span>
                </div>
                {answer ? (
                  <span className="text-2xl font-bold text-navy">
                    {answer.score}
                    <span className="text-sm text-muted">/100</span>
                  </span>
                ) : (
                  <span className="text-sm text-muted">Not answered</span>
                )}
              </div>

              <p className="mt-3 font-medium text-ink">
                {i + 1}. {question.content}
              </p>

              {answer && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Your answer</p>
                    <p className="neu-inset mt-1 p-4 text-ink">{answer.content}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Feedback</p>
                    <p className="mt-1 text-ink">{answer.feedback}</p>
                  </div>
                  <p className="text-xs text-muted">⏱ {answer.timeSpentSeconds}s</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">{children}</div>
  );
}