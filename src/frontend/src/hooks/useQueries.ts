import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, TwitchAccount, RevenueEntry, TwitchAccountStatus, Variant_affiliate_partner, SubscriptionTier, SubscriptionStatus, SubscriptionPlan } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Owner Status Check
export function useIsUserOwner() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isUserOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isUserOwner();
    },
    enabled: !!actor && !isFetching,
  });
}

// Subscription Management
export function useCheckSubscriptionStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionStatus>({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkSubscriptionStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateStripeSubscription() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (planId: bigint): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createStripeSubscription(planId);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    },
  });
}

// Subscription Plan Management (Owner-only)
export function useGetAllSubscriptionPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubscriptionPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      tier,
      priceInCents,
      features,
    }: {
      name: string;
      description: string;
      tier: SubscriptionTier;
      priceInCents: bigint;
      features: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscriptionPlan(name, description, tier, priceInCents, features);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast.success('Subscription plan created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create plan: ${error.message}`);
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      name,
      description,
      priceInCents,
      features,
      isActive,
    }: {
      planId: bigint;
      name: string;
      description: string;
      priceInCents: bigint;
      features: string[];
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscriptionPlan(planId, name, description, priceInCents, features, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast.success('Subscription plan updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update plan: ${error.message}`);
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSubscriptionPlan(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast.success('Subscription plan deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete plan: ${error.message}`);
    },
  });
}

export function useToggleSubscriptionPlanStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleSubscriptionPlanStatus(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast.success('Plan status toggled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to toggle plan status: ${error.message}`);
    },
  });
}

// Twitch Account Management
export function useGetAllTwitchAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery<TwitchAccount[]>({
    queryKey: ['twitchAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTwitchAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTwitchAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      accountType,
    }: {
      username: string;
      accountType: Variant_affiliate_partner;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTwitchAccount(username, accountType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twitchAccounts'] });
      toast.success('Twitch account added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add Twitch account: ${error.message}`);
    },
  });
}

export function useGetTwitchAccount(accountId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TwitchAccount | null>({
    queryKey: ['twitchAccount', accountId?.toString()],
    queryFn: async () => {
      if (!actor || !accountId) return null;
      return actor.getTwitchAccount(accountId);
    },
    enabled: !!actor && !isFetching && accountId !== null,
  });
}

export function useUpdateTwitchAccountStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      status,
    }: {
      accountId: bigint;
      status: TwitchAccountStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTwitchAccountStatus(accountId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twitchAccounts'] });
      toast.success('Account status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update account status: ${error.message}`);
    },
  });
}

// Revenue Management
export function useGetAllRevenueEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<RevenueEntry[]>({
    queryKey: ['revenueEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRevenueEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRevenueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountId,
      amount,
      description,
    }: {
      accountId: bigint;
      amount: number;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRevenueEntry(accountId, amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueEntries'] });
      toast.success('Revenue entry added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add revenue entry: ${error.message}`);
    },
  });
}

export function useGetRevenueEntry(revenueId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<RevenueEntry | null>({
    queryKey: ['revenueEntry', revenueId?.toString()],
    queryFn: async () => {
      if (!actor || !revenueId) return null;
      return actor.getRevenueEntry(revenueId);
    },
    enabled: !!actor && !isFetching && revenueId !== null,
  });
}
