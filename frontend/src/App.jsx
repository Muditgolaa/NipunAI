import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewSession from "./pages/NewSession";
import Session from "./pages/Session";
import ProtectedRoute from "./components/ProtectedRoute";
import Report from "./pages/Report";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/sessions/new" element={<ProtectedRoute><NewSession /></ProtectedRoute>} />
      <Route path="/sessions/:id" element={<ProtectedRoute><Session /></ProtectedRoute>} />
      <Route path="/sessions/:id/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
    </Routes>
  );
}