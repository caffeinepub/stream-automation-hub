import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsUserOwner } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Zap, LogOut, LogIn, DollarSign, CreditCard, Shield, Bot, MessageCircle, Hash, TrendingUp, Calculator as CalculatorIcon, Wallet, ExternalLink } from 'lucide-react';
import { SiTwitch, SiStripe } from 'react-icons/si';
import { Toaster } from './ui/sonner';
import { ThemeProvider } from 'next-themes';
import TwitchSubscribeWidget from './TwitchSubscribeWidget';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { toast } from 'sonner';

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

  const handleStripeConnect = () => {
    // Stripe Connect OAuth URL
    // Note: In production, you would need to configure your Stripe Connect application
    // and use the actual client_id from your Stripe dashboard
    const stripeConnectUrl = 'https://connect.stripe.com/oauth/authorize';
    const clientId = 'ca_YOUR_STRIPE_CLIENT_ID'; // Replace with actual Stripe Connect client ID
    const redirectUri = `${window.location.origin}/stripe-callback`;
    const scope = 'read_write';
    
    const url = `${stripeConnectUrl}?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Open Stripe Connect in a new window
    const stripeWindow = window.open(url, 'stripe-connect', 'width=600,height=700');
    
    if (!stripeWindow) {
      toast.error('Please allow popups to connect your Stripe account');
    } else {
      toast.info('Opening Stripe Connect...');
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-menu-bg backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => isAuthenticated && navigate({ to: '/' })}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Stream Automation Hub</h1>
                  <p className="text-xs text-muted-foreground">Manage Twitch Revenue</p>
                </div>
              </div>
              {isAuthenticated && (
                <nav className="hidden lg:flex items-center gap-2">
                  <Button
                    variant={currentPath === '/' || currentPath.startsWith('/twitch-accounts') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/twitch-accounts' })}
                    className="gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Twitch
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
                  <Button
                    variant={currentPath === '/ai-assistant' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/ai-assistant' })}
                    className="gap-2"
                  >
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </Button>
                  <Button
                    variant={currentPath === '/chat-room' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/chat-room' })}
                    className="gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Inuyasha Chat
                  </Button>
                  <Button
                    variant={currentPath === '/discord-tools' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/discord-tools' })}
                    className="gap-2"
                  >
                    <Hash className="h-4 w-4" />
                    Discord Tools
                  </Button>
                  <Button
                    variant={currentPath === '/finance-tracker' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/finance-tracker' })}
                    className="gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Finance
                  </Button>
                  <Button
                    variant={currentPath === '/calculator' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/calculator' })}
                    className="gap-2"
                  >
                    <CalculatorIcon className="h-4 w-4" />
                    Calculator
                  </Button>
                  <Button
                    variant={currentPath === '/donation-manager' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate({ to: '/donation-manager' })}
                    className="gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Donations
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
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm">Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => navigate({ to: '/twitch-accounts' })}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Twitch Accounts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: hasActiveSubscription ? '/subscription-management' : '/subscription-plans' })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ to: '/ai-assistant' })}>
                      <Bot className="h-4 w-4 mr-2" />
                      AI Assistant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/chat-room' })}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Inuyasha Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/discord-tools' })}>
                      <Hash className="h-4 w-4 mr-2" />
                      Discord Tools
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/finance-tracker' })}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Finance Tracker
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/calculator' })}>
                      <CalculatorIcon className="h-4 w-4 mr-2" />
                      Calculator
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate({ to: '/donation-manager' })}>
                      <Wallet className="h-4 w-4 mr-2" />
                      Donations
                    </DropdownMenuItem>
                    {isOwner && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && isOwner && (
                <Button
                  onClick={handleStripeConnect}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/10"
                >
                  <SiStripe className="h-4 w-4" />
                  <span className="hidden md:inline">Connect Bank</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
              {isAuthenticated && (
                <>
                  <TwitchSubscribeWidget />
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-2 hidden sm:flex"
                  >
                    <a
                      href="https://www.twitch.tv/auroramoonveil"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiTwitch className="h-4 w-4" />
                      <span className="hidden md:inline">@auroramoonveil</span>
                    </a>
                  </Button>
                </>
              )}
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
                    <span className="hidden sm:inline">Logout</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </div>
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
