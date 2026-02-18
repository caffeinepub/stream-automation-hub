import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsUserOwner } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Zap, LogOut, LogIn, DollarSign, CreditCard, Shield } from 'lucide-react';
import { Toaster } from './ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function Layout() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isOwner } = useIsUserOwner();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  const hasActiveSubscription = userProfile?.subscriptionStatus === 'active';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
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

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => isAuthenticated && navigate({ to: '/' })}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.15_25)] to-[oklch(0.55_0.12_120)] flex items-center justify-center shadow-sm">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Stream Automation Hub</h1>
                  <p className="text-xs text-muted-foreground">Manage Twitch Revenue</p>
                </div>
              </div>
              {isAuthenticated && (
                <nav className="hidden md:flex items-center gap-2">
                  <Button
                    variant={currentPath === '/' || currentPath.startsWith('/twitch-accounts') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/twitch-accounts' })}
                    className="gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Twitch Accounts
                  </Button>
                  <Button
                    variant={currentPath.startsWith('/subscription') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: hasActiveSubscription ? '/subscription-management' : '/subscription-plans' })}
                    className="gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </Button>
                  {isOwner && (
                    <Button
                      variant={currentPath === '/admin' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => navigate({ to: '/admin' })}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  )}
                </nav>
              )}
            </div>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="gap-2"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Stream Automation Hub. All rights reserved.</p>
              <p>
                Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    window.location.hostname
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
