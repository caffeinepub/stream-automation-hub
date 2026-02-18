import { Button } from './ui/button';
import { SiTwitch } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function TwitchSubscribeWidget() {
  const handleSubscribe = () => {
    window.open('https://www.twitch.tv/auroramoonveil', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleSubscribe}
      variant="default"
      size="sm"
      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
    >
      <SiTwitch className="h-4 w-4" />
      <Heart className="h-3 w-3 fill-current" />
      <span className="hidden sm:inline">Subscribe</span>
    </Button>
  );
}
