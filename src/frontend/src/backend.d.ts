import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface RevenueEntry {
    id: bigint;
    accountId: bigint;
    description: string;
    timestamp: bigint;
    amount: number;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface TwitchAccount {
    id: bigint;
    status: TwitchAccountStatus;
    username: string;
    owner: Principal;
    accountType: Variant_affiliate_partner;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface SubscriptionPlan {
    id: bigint;
    features: Array<string>;
    name: string;
    tier: SubscriptionTier;
    description: string;
    isActive: boolean;
    priceInCents: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    twitchUsername?: string;
    subscriptionEndDate?: bigint;
    name: string;
    subscriptionTier?: SubscriptionTier;
    subscriptionStatus: SubscriptionStatus;
    stripeCustomerId?: string;
    subscriptionStartDate?: bigint;
    isOwner: boolean;
}
export enum SubscriptionStatus {
    active = "active",
    cancelled = "cancelled",
    inactive = "inactive"
}
export enum SubscriptionTier {
    annual = "annual",
    monthly = "monthly"
}
export enum TwitchAccountStatus {
    pending = "pending",
    approved = "approved",
    suspended = "suspended"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_affiliate_partner {
    affiliate = "affiliate",
    partner = "partner"
}
export interface backendInterface {
    addRevenueEntry(accountId: bigint, amount: number, description: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createStripeSubscription(planId: bigint): Promise<string>;
    createSubscriptionPlan(name: string, description: string, tier: SubscriptionTier, priceInCents: bigint, features: Array<string>): Promise<bigint>;
    createTwitchAccount(username: string, accountType: Variant_affiliate_partner): Promise<bigint>;
    deleteSubscriptionPlan(planId: bigint): Promise<void>;
    getActiveSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getAdminDashboardStats(): Promise<{
        totalUsers: bigint;
        totalRevenue: number;
        activeSubscriptions: bigint;
    }>;
    getAllRevenueEntries(): Promise<Array<RevenueEntry>>;
    getAllSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getAllTwitchAccounts(): Promise<Array<TwitchAccount>>;
    getAllUsersAdmin(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRevenueEntry(revenueId: bigint): Promise<RevenueEntry | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubscriptionPlan(planId: bigint): Promise<SubscriptionPlan | null>;
    getTwitchAccount(accountId: bigint): Promise<TwitchAccount | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setUserOwnerStatus(user: Principal, isOwnerStatus: boolean): Promise<void>;
    toggleSubscriptionPlanStatus(planId: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSubscriptionPlan(planId: bigint, name: string, description: string, priceInCents: bigint, features: Array<string>, isActive: boolean): Promise<void>;
    updateTwitchAccountStatus(accountId: bigint, status: TwitchAccountStatus): Promise<void>;
    upgradeTwitchAccount(accountId: bigint, accountType: Variant_affiliate_partner): Promise<void>;
}
