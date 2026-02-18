import DiscordServerBuilder from '../components/DiscordServerBuilder';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function DiscordToolsPage() {
  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <DiscordServerBuilder />
        </div>
      </div>
    </SubscriptionGuard>
  );
}
