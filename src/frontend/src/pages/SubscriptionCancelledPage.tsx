import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function SubscriptionCancelledPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-destructive/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
            <CardDescription className="text-base mt-2">
              Your subscription payment was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              It looks like you cancelled the payment process or there was an issue completing your subscription.
            </p>
            <p className="text-muted-foreground">
              Don't worry! You can try again anytime. If you experienced an error, please try again or contact support.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/twitch-accounts' })}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate({ to: '/subscription-plans' })}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
