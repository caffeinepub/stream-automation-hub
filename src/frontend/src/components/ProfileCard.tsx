import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Crown, User } from 'lucide-react';
import { Badge } from './ui/badge';

export default function ProfileCard() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return null;
  }

  const isOwner = userProfile.isOwner === true;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Name:</p>
            <p className="text-sm text-muted-foreground">{userProfile.name}</p>
            {isOwner && (
              <Badge variant="default" className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Owner
              </Badge>
            )}
          </div>
          {userProfile.twitchUsername && (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Twitch:</p>
              <p className="text-sm text-muted-foreground">{userProfile.twitchUsername}</p>
            </div>
          )}
        </div>
        {isOwner && (
          <Button
            onClick={() => navigate({ to: '/admin' })}
            variant="outline"
            className="w-full"
          >
            <Crown className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
