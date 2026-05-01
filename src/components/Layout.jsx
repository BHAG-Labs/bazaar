import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const linkCls = 'text-xs uppercase tracking-[0.15em] text-charcoal/70 hover:text-charcoal transition-colors';

function PublicNav() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-heading font-bold text-xl text-charcoal tracking-tight">Bazaar</span>
          <span className="text-[10px] text-charcoal/50 font-subheading">by BHAG Labs</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/archive" className={linkCls}>Archive</Link>
          <a href="https://bhaglabs.com" className={`${linkCls} hidden sm:inline`}>BHAG Labs ↗</a>
          {user ? (
            <Link to="/profile" className="btn-terracotta !py-2 !px-4 text-[11px]">Dashboard</Link>
          ) : (
            <Link to="/login" className="btn-terracotta !py-2 !px-4 text-[11px]">Log in</Link>
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
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-heading font-bold text-xl text-charcoal tracking-tight">Bazaar</span>
          <span className="text-[10px] text-charcoal/50 font-subheading">by BHAG Labs</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/archive" className={linkCls}>Archive</Link>
          {isAdmin && <Link to="/admin" className={linkCls}>Admin</Link>}
          <Link to="/profile" className={linkCls}>Profile</Link>
          <button
            onClick={handleSignOut}
            className="text-xs uppercase tracking-[0.15em] text-charcoal/70 hover:text-terracotta transition-colors cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-cream">
      {variant === 'public' ? <PublicNav /> : <AppNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
