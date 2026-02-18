import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Zap, DollarSign, TrendingUp, Shield, Bot, MessageCircle, Hash, Calculator as CalculatorIcon, Wallet } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner-purple-pink.dim_1200x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">Stream Automation Hub</h1>
            <p className="text-xl text-white/90 mb-8">
              Manage your Twitch revenue, track finances, and access powerful tools for content creators
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 gap-2 text-lg px-8 py-6"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Twitch Revenue Tracking</CardTitle>
                <CardDescription>
                  Monitor your Twitch income, manage multiple accounts, and track revenue streams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get help creating games, apps, and projects with our intelligent AI assistant
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Inuyasha Chat Room</CardTitle>
                <CardDescription>
                  Connect with other fans in our themed chat room with real-time messaging
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Discord Server Builder</CardTitle>
                <CardDescription>
                  Plan and configure your Discord server with our comprehensive tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Finance Tracker</CardTitle>
                <CardDescription>
                  Track income and expenses, monitor your financial health with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Donation Manager</CardTitle>
                <CardDescription>
                  Connect payment wallets and track donations from your supporters
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
