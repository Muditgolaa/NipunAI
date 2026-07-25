import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function NewSession() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Create the session (status: pending)
      const { session } = await api.post("/api/sessions", {
        jobTitle,
        company,
        jobDescription,
      });
      // 2. Generate its 8 questions with Groq (synchronous, ~2-3s)
      await api.post(`/api/sessions/${session._id}/generate`);
      // 3. Go to the interview page
      navigate(`/sessions/${session._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  // Loading screen while Groq works.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="neu max-w-md p-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-navy/20 border-t-navy" />
          <h2 className="mt-6 text-xl font-semibold text-navy">Generating your questions…</h2>
          <p className="mt-2 text-muted">
            The AI is crafting 8 role-specific questions. This takes a few seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="neu w-full max-w-xl p-8">
        <h1 className="text-2xl font-bold text-navy">New interview session</h1>
        <p className="mt-1 text-muted">
          Paste a job description and we'll generate tailored questions.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="neu-input w-full px-5 py-3"
            placeholder="Job title (e.g. Backend Developer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
          <input
            className="neu-input w-full px-5 py-3"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <textarea
            className="neu-inset w-full min-h-40 resize-y px-5 py-4"
            placeholder="Paste the job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="neu-btn px-6 py-3 font-medium"
            >
              Cancel
            </button>
            <button type="submit" className="neu-btn-primary flex-1 py-3 font-medium">
              Generate questions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}