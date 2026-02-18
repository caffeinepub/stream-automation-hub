import AIAssistant from '../components/AIAssistant';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function AIAssistantPage() {
  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <AIAssistant />
        </div>
      </div>
    </SubscriptionGuard>
  );
}
