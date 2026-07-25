import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return <p className="text-slate-300">🏠 Home page — routing works.</p>;
}

function About() {
  return <p className="text-slate-300">ℹ️ About page — routing works.</p>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-indigo-400">NipunAI</h1>
      <p className="mt-2 text-slate-400">Frontend scaffold is alive 🚀</p>

      <nav className="mt-6 flex gap-4">
        <Link className="text-indigo-400 hover:underline" to="/">Home</Link>
        <Link className="text-indigo-400 hover:underline" to="/about">About</Link>
      </nav>

      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}