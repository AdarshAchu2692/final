import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const isCreator = localStorage.getItem('isCreator') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isCreator');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold" data-testid="nav-logo">
            Biddge
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-about">
              About
            </Link>
            <Link to="/communities" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-communities">
              Communities
            </Link>
            <Link to="/membership" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-membership">
              Membership
            </Link>
            {isCreator && (
              <Link to="/creator-dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-creator">
                Creator Dashboard
              </Link>
            )}
            <Link to="/events" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-events">
              Events
            </Link>
            <Link to="/careers" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" data-testid="nav-careers">
              Careers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User size={16} />
                  <span data-testid="user-name">{userName}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white"
                  data-testid="logout-button"
                >
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  className="bg-primary text-white rounded-full px-6 py-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  data-testid="login-nav-button"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};