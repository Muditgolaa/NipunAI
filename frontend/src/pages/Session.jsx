import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export default function Session() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`/api/sessions/${id}/questions`);

  if (loading) return <Centered>Loading questions…</Centered>;
  if (error) return <Centered>Error: {error}</Centered>;

  const questions = data?.questions || [];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-navy">Interview</h1>
      <p className="mt-1 text-muted">{questions.length} questions generated ✅</p>

      <div className="mt-6 max-w-2xl space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="neu p-5">
            <div className="flex gap-2 text-xs text-muted">
              <span className="neu-inset rounded-full px-3 py-1">{q.category}</span>
              <span className="neu-inset rounded-full px-3 py-1">{q.difficulty}</span>
            </div>
            <p className="mt-3 text-ink">
              {q.order}. {q.content}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="neu-btn mt-8 px-6 py-3 font-medium"
      >
        Back to dashboard
      </button>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">{children}</div>
  );
}