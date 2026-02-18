import FinanceTracker from '../components/FinanceTracker';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function FinanceTrackerPage() {
  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <FinanceTracker />
        </div>
      </div>
    </SubscriptionGuard>
  );
}
