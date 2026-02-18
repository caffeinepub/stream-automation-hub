import { useNavigate } from '@tanstack/react-router';
import type { TwitchAccount, RevenueEntry } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DollarSign, Eye } from 'lucide-react';
import { SiTwitch } from 'react-icons/si';

interface TwitchAccountCardProps {
  account: TwitchAccount;
  revenues: RevenueEntry[];
}

export default function TwitchAccountCard({ account, revenues }: TwitchAccountCardProps) {
  const navigate = useNavigate();

  const accountRevenues = revenues.filter((rev) => rev.accountId === account.id);
  const totalRevenue = accountRevenues.reduce((sum, entry) => sum + entry.amount, 0);

  const isPartner = account.accountType === 'partner';
  const bgColor = isPartner ? 'bg-[oklch(0.65_0.15_25)]/10' : 'bg-[oklch(0.55_0.12_120)]/10';
  const iconColor = isPartner ? 'text-[oklch(0.65_0.15_25)]' : 'text-[oklch(0.55_0.12_120)]';

  const handleViewRevenue = () => {
    navigate({ to: `/twitch-accounts/${account.id.toString()}/revenue` });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
              <SiTwitch className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{account.username}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant={isPartner ? 'default' : 'secondary'} className="text-xs">
                  {isPartner ? 'Partner' : 'Affiliate'}
                </Badge>
              </div>
            </div>
          </div>
          <Badge
            variant={
              account.status === 'approved'
                ? 'default'
                : account.status === 'pending'
                ? 'secondary'
                : 'destructive'
            }
            className="text-xs"
          >
            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
          </div>
          <span className="text-lg font-bold text-foreground">${totalRevenue.toFixed(2)}</span>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleViewRevenue}
        >
          <Eye className="h-4 w-4" />
          View Revenue Details
        </Button>
      </CardContent>
    </Card>
  );
}
