import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, TwitchAccount, RevenueEntry, SubscriptionPlan, SubscriptionTier, SubscriptionStatus, Variant_affiliate_partner, TwitchAccountStatus } from '../backend';

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
    },
  });
}

export function useCheckSubscriptionStatus() {
  const { data: userProfile } = useGetCallerUserProfile();
  return {
    data: userProfile?.subscriptionStatus || SubscriptionStatus.inactive,
    isLoading: false,
  };
}

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

export function useCreateTwitchAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, accountType }: { username: string; accountType: Variant_affiliate_partner }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTwitchAccount(username, accountType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twitchAccounts'] });
    },
  });
}

export function useUpgradeTwitchAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, accountType }: { accountId: bigint; accountType: Variant_affiliate_partner }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeTwitchAccount(accountId, accountType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twitchAccounts'] });
    },
  });
}

export function useUpdateTwitchAccountStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, status }: { accountId: bigint; status: TwitchAccountStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTwitchAccountStatus(accountId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twitchAccounts'] });
    },
  });
}

export function useGetAllRevenueEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<RevenueEntry[]>({
    queryKey: ['revenues'],
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
    mutationFn: async ({ accountId, amount, description }: { accountId: bigint; amount: number; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRevenueEntry(accountId, amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenues'] });
    },
  });
}

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

export function useGetActiveSubscriptionPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionPlan[]>({
    queryKey: ['activeSubscriptionPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveSubscriptionPlans();
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
  });
}

export function useCreateSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, tier, priceInCents, features }: { name: string; description: string; tier: SubscriptionTier; priceInCents: bigint; features: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscriptionPlan(name, description, tier, priceInCents, features);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptionPlans'] });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, name, description, priceInCents, features, isActive }: { planId: bigint; name: string; description: string; priceInCents: bigint; features: string[]; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscriptionPlan(planId, name, description, priceInCents, features, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptionPlans'] });
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
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptionPlans'] });
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
      queryClient.invalidateQueries({ queryKey: ['activeSubscriptionPlans'] });
    },
  });
}
