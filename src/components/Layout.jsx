import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function PublicNav() {
  const { user } = useAuth();
  return (
    <header className="border-b border-surface-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand">Bazaar</span>
          <span className="text-sm text-slate-400 hidden sm:inline">by BHAG Labs</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/archive" className="text-sm text-slate-300 hover:text-white transition-colors">
            Archive
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="text-sm px-4 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-light transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-light transition-colors"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function AppNav() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <header className="border-b border-surface-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand">Bazaar</span>
          <span className="text-sm text-slate-400 hidden sm:inline">by BHAG Labs</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/archive" className="text-sm text-slate-300 hover:text-white transition-colors">
            Archive
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-slate-300 hover:text-white transition-colors">
              Admin
            </Link>
          )}
          <Link to="/profile" className="text-sm text-slate-300 hover:text-white transition-colors">
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm px-4 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function Layout({ variant = 'public' }) {
  return (
    <div className="min-h-screen flex flex-col">
      {variant === 'public' ? <PublicNav /> : <AppNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-surface-border py-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} BHAG Labs. All rights reserved.
      </footer>
    </div>
  );
}
