import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="neu w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-navy">NipunAI</h1>
        <p className="mt-1 text-muted">Your AI Interview Coach</p>

        {isAuthenticated ? (
          <div className="mt-8">
            <div className="neu-inset px-4 py-3">
              ✅ Logged in as <span className="font-semibold text-navy">{user.email}</span>
            </div>
            <button onClick={logout} className="neu-btn mt-6 px-8 py-3 font-medium">
              Log out
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-muted">Not logged in.</p>
            <button
              onClick={() =>
                login("mudit@test.com", "secret123").catch((e) => alert(e.message))
              }
              className="neu-btn-primary mt-6 px-10 py-3 font-medium"
            >
              Test login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}