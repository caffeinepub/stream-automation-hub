import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Crown } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isOwner = userProfile?.isOwner === true;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b bg-menu-bg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                  StreamRevenue
                </Link>
                {isAuthenticated && (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/twitch-accounts"
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Twitch Accounts
                    </Link>
                    <Link
                      to="/tracking"
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Tracking
                    </Link>
                    <Link
                      to="/subscription-management"
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Profile
                    </Link>
                    {isOwner && (
                      <Link
                        to="/admin"
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        <Crown className="h-4 w-4 text-amber-500" />
                        Admin
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleAuth}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
              >
                {buttonText}
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t py-6 bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} StreamRevenue. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
