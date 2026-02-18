import type { RevenueEntry } from '../backend';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DollarSign, Calendar } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface RevenueChartProps {
  revenues: RevenueEntry[];
  isLoading: boolean;
}

export default function RevenueChart({ revenues, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (revenues.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No revenue entries yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            Add revenue entries to track your passive income
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedRevenues = [...revenues].sort((a, b) => Number(b.timestamp - a.timestamp));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRevenues.map((entry) => (
              <TableRow key={entry.id.toString()}>
                <TableCell className="font-medium">
                  {formatDate(entry.timestamp)}
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right font-semibold">
                  ${entry.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-sm font-medium text-foreground">Total Revenue</span>
        <span className="text-2xl font-bold text-primary">
          ${revenues.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
