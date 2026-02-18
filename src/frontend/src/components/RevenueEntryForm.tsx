import { useForm } from 'react-hook-form';
import { useAddRevenueEntry, useGetAllTwitchAccounts } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';

interface RevenueEntryFormProps {
  onSuccess: () => void;
}

interface FormData {
  accountId: string;
  amount: string;
  description: string;
}

export default function RevenueEntryForm({ onSuccess }: RevenueEntryFormProps) {
  const addRevenue = useAddRevenueEntry();
  const { data: accounts = [] } = useGetAllTwitchAccounts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      accountId: '',
      amount: '',
      description: '',
    },
  });

  const selectedAccountId = watch('accountId');

  const onSubmit = async (data: FormData) => {
    await addRevenue.mutateAsync({
      accountId: BigInt(data.accountId),
      amount: parseFloat(data.amount),
      description: data.description,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Account Selection */}
      <div className="space-y-2">
        <Label htmlFor="accountId">
          Twitch Account <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedAccountId}
          onValueChange={(value) => setValue('accountId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id.toString()} value={account.id.toString()}>
                {account.username} ({account.accountType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountId && (
          <p className="text-sm text-destructive">{errors.accountId.message}</p>
        )}
        {accounts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Please add a Twitch account first
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount (USD) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g., 50.00"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0, message: 'Amount must be positive' },
          })}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="e.g., Subscription revenue, Ad revenue, Bits"
          rows={3}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={addRevenue.isPending || accounts.length === 0}
          className="flex-1"
        >
          {addRevenue.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Revenue
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
