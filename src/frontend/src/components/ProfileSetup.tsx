import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { SubscriptionStatus } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [twitchUsername, setTwitchUsername] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        isOwner: false,
        twitchUsername: twitchUsername.trim() || undefined,
        stripeCustomerId: undefined,
        subscriptionStatus: SubscriptionStatus.inactive,
        subscriptionTier: undefined,
        subscriptionStartDate: undefined,
        subscriptionEndDate: undefined,
      });
      toast.success('Profile created successfully!');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Set up your profile</DialogTitle>
          <DialogDescription>
            Please enter your name and optionally your Twitch username to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitchUsername">Twitch Username (Optional)</Label>
            <Input
              id="twitchUsername"
              value={twitchUsername}
              onChange={(e) => setTwitchUsername(e.target.value)}
              placeholder="Enter your Twitch username"
            />
            <p className="text-xs text-muted-foreground">
              If you're the app owner, enter 'auroramoonveil' to be recognized as owner.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
