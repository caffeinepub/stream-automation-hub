import DonationManager from '../components/DonationManager';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function DonationManagerPage() {
  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <DonationManager />
        </div>
      </div>
    </SubscriptionGuard>
  );
}
