import SubscriptionStatusCard from '../components/SubscriptionStatusCard';
import ProfileCard from '../components/ProfileCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function SubscriptionManagementPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">
            View and manage your subscription details
          </p>
        </div>

        <div className="space-y-6">
          <ProfileCard />
          <SubscriptionStatusCard />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Manage Your Subscription
              </CardTitle>
              <CardDescription>
                Update payment methods, view invoices, and manage billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To update your payment method, view past invoices, or cancel your subscription, 
                you'll need to access the Stripe Customer Portal. This secure portal allows you to 
                manage all aspects of your subscription billing.
              </p>
              <p className="text-sm text-muted-foreground">
                Note: The Stripe Customer Portal integration is managed through your subscription 
                provider and provides a secure way to handle payment information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
