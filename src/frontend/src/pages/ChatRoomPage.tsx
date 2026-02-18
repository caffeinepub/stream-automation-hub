import ChatRoom from '../components/ChatRoom';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function ChatRoomPage() {
  return (
    <SubscriptionGuard>
      <ChatRoom />
    </SubscriptionGuard>
  );
}
