import { useForm } from 'react-hook-form';
import { useCreateTwitchAccount } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Loader2, Award, Star } from 'lucide-react';
import { Variant_affiliate_partner } from '../backend';

interface TwitchAccountFormProps {
  onSuccess: () => void;
}

interface FormData {
  username: string;
  accountType: 'affiliate' | 'partner';
}

export default function TwitchAccountForm({ onSuccess }: TwitchAccountFormProps) {
  const createAccount = useCreateTwitchAccount();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      accountType: 'affiliate',
    },
  });

  const accountType = watch('accountType');

  const onSubmit = async (data: FormData) => {
    await createAccount.mutateAsync({
      username: data.username,
      accountType: data.accountType as Variant_affiliate_partner,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">
          Twitch Username <span className="text-destructive">*</span>
        </Label>
        <Input
          id="username"
          placeholder="e.g., your_twitch_username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      {/* Account Type Selection */}
      <div className="space-y-3">
        <Label>Account Type</Label>
        <RadioGroup
          value={accountType}
          onValueChange={(value) => setValue('accountType', value as 'affiliate' | 'partner')}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="affiliate" id="affiliate" className="peer sr-only" />
            <Label
              htmlFor="affiliate"
              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[oklch(0.55_0.12_120)] peer-data-[state=checked]:bg-[oklch(0.55_0.12_120)]/5 cursor-pointer transition-all"
            >
              <Star className="h-8 w-8 mb-2 text-[oklch(0.55_0.12_120)]" />
              <span className="font-semibold">Affiliate</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="partner" id="partner" className="peer sr-only" />
            <Label
              htmlFor="partner"
              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[oklch(0.65_0.15_25)] peer-data-[state=checked]:bg-[oklch(0.65_0.15_25)]/5 cursor-pointer transition-all"
            >
              <Award className="h-8 w-8 mb-2 text-[oklch(0.65_0.15_25)]" />
              <span className="font-semibold">Partner</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={createAccount.isPending} className="flex-1">
          {createAccount.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Account
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
