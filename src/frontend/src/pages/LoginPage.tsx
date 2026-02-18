import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Zap, DollarSign, TrendingUp } from 'lucide-react';
import { SiTwitch } from 'react-icons/si';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="Stream Automation Hub"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="px-8 md:px-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Manage Your Twitch Revenue
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Track passive income from your Twitch affiliate and partner accounts
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.65_0.15_25)] to-[oklch(0.55_0.12_120)] flex items-center justify-center mb-4 shadow-md">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Login to manage your Twitch accounts and revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="w-full text-lg h-12"
              >
                {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure authentication powered by Internet Computer
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Features</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 rounded-lg bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-[oklch(0.55_0.12_120)]/10 flex items-center justify-center shrink-0">
                  <SiTwitch className="h-5 w-5 text-[oklch(0.55_0.12_120)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Twitch Account Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Add and manage multiple Twitch affiliate and partner accounts
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-lg bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Revenue Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Track passive income from subscriptions, ads, and bits
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-lg bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Income Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    View detailed revenue history and earnings breakdown
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
