import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useFetch } from "../hooks/useFetch";

export default function Session() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`/api/sessions/${id}/questions`);

  const questions = data?.questions || [];
  const [index, setIndex] = useState(0);      // which question we're on
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);  // timer for the current question
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // {score, feedback} after scoring
  const [done, setDone] = useState(false);

  const current = questions[index];

  // Timer: tick every second. Pauses while loading, showing a result, or done.
  useEffect(() => {
    if (loading || done || result) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);       // cleanup so we don't leak intervals
  }, [loading, done, result, index]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/api/questions/${current._id}/answers`, {
        content: answer,
        timeSpentSeconds: seconds,
      });
      setResult(res.answer); // { score, feedback }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setSeconds(0);
      setResult(null);
    }
  }

  if (loading) return <Centered>Loading questions…</Centered>;
  if (error) return <Centered>Error: {error}</Centered>;

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="neu max-w-md p-10 text-center">
          <div className="text-5xl">🎉</div>
          <h2 className="mt-4 text-2xl font-bold text-navy">Interview complete!</h2>
          <p className="mt-2 text-muted">
            You answered all {questions.length} questions. See your full breakdown.
          </p>
          <Link
            to={`/sessions/${id}/report`}
            className="neu-btn-primary mt-6 inline-block px-8 py-3 font-medium"
          >
            View report
          </Link>
          <div className="mt-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="neu-btn px-6 py-2 text-sm font-medium"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return <Centered>No questions found.</Centered>;

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress + timer */}
        <div className="flex items-center justify-between">
          <span className="neu-inset rounded-full px-4 py-2 text-sm font-medium text-navy">
            Question {index + 1} of {questions.length}
          </span>
          <span className="neu-inset rounded-full px-4 py-2 font-mono text-sm text-navy">
            ⏱ {mins}:{secs}
          </span>
        </div>

        {/* The question */}
        <div className="neu mt-6 p-6">
          <div className="flex gap-2 text-xs text-muted">
            <span className="neu-inset rounded-full px-3 py-1">{current.category}</span>
            <span className="neu-inset rounded-full px-3 py-1">{current.difficulty}</span>
          </div>
          <p className="mt-4 text-lg text-ink">{current.content}</p>
        </div>

        {result ? (
          /* Score + feedback after submitting */
          <div className="neu mt-6 p-6">
            <p className="text-center text-muted">Your score</p>
            <p className="text-center text-5xl font-bold text-navy">
              {result.score}
              <span className="text-2xl text-muted">/100</span>
            </p>
            <p className="mt-4 text-ink">{result.feedback}</p>
            <button
              onClick={nextQuestion}
              className="neu-btn-primary mt-6 w-full py-3 font-medium"
            >
              {index + 1 >= questions.length ? "Finish" : "Next question"}
            </button>
          </div>
        ) : (
          /* Answer form */
          <form onSubmit={handleSubmit} className="mt-6">
            <textarea
              className="neu-inset min-h-48 w-full resize-y px-5 py-4"
              placeholder="Type your answer here…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="neu-btn-primary mt-4 w-full py-3 font-medium disabled:opacity-60"
            >
              {submitting ? "Scoring…" : "Submit answer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">{children}</div>
  );
}