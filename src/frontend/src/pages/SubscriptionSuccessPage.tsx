import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate subscription status to refresh the UI
    queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  }, [queryClient]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-[oklch(0.55_0.12_120)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[oklch(0.55_0.12_120)]/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-[oklch(0.55_0.12_120)]" />
              </div>
            </div>
            <CardTitle className="text-3xl">Subscription Activated!</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to Stream Automation Hub Premium
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your subscription has been successfully activated. You now have full access to all premium features including:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.55_0.12_120)]" />
                <span>Unlimited Twitch account management</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.55_0.12_120)]" />
                <span>Comprehensive revenue tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.55_0.12_120)]" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/twitch-accounts' })}
              className="gap-2"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
