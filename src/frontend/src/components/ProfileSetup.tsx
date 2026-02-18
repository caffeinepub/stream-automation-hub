import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { User, Loader2 } from 'lucide-react';
import { SubscriptionStatus } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveProfile.mutateAsync({
        name: name.trim(),
        isOwner: false,
        subscriptionStatus: SubscriptionStatus.inactive,
        stripeCustomerId: undefined,
        subscriptionTier: undefined,
        subscriptionStartDate: undefined,
        subscriptionEndDate: undefined,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[oklch(0.65_0.15_25)] to-[oklch(0.55_0.12_120)] flex items-center justify-center mb-4 shadow-md">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Please tell us your name to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={saveProfile.isPending || !name.trim()}>
              {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
