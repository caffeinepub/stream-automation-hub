import Set "mo:core/Set";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Migrate old data to new type.
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
    isOwner : Bool;
    twitchUsername : ?Text;
    stripeCustomerId : ?Text;
    subscriptionStatus : SubscriptionStatus;
    subscriptionTier : ?SubscriptionTier;
    subscriptionStartDate : ?Nat;
    subscriptionEndDate : ?Nat;
  };

  public type SubscriptionTier = { #monthly; #annual };
  public type SubscriptionStatus = { #inactive; #active; #cancelled };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Define the owner username
  let OWNER_USERNAME : Text = "CelestiNix";
  let OWNER_TWITCH_USERNAME : Text = "auroramoonveil";

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Automatically detect owner based on Twitch username
    let isOwnerWithTwitch = switch (profile.twitchUsername) {
      case (?username) { Text.equal(username, OWNER_TWITCH_USERNAME) };
      case (null) { false };
    };

    // Users cannot manually set isOwner to true unless they have the correct Twitch username
    if (profile.isOwner and not isOwnerWithTwitch) {
      Runtime.trap("Unauthorized: Only the app owner can have isOwner = true");
    };

    userProfiles.add(
      caller,
      {
        profile with
        isOwner = isOwnerWithTwitch;
      },
    );
  };

  public shared ({ caller }) func setUserOwnerStatus(user : Principal, isOwnerStatus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set owner status");
    };

    switch (userProfiles.get(user)) {
      case (?profile) {
        // Only allow setting owner status to true if Twitch username matches
        if (isOwnerStatus) {
          let isOwnerWithTwitch = switch (profile.twitchUsername) {
            case (?username) { Text.equal(username, OWNER_TWITCH_USERNAME) };
            case (null) { false };
          };

          if (not isOwnerWithTwitch) {
            Runtime.trap("Unauthorized: Only user with Twitch username 'auroramoonveil' can have owner status");
          };
        };

        let updatedProfile = { profile with isOwner = isOwnerStatus };
        userProfiles.add(user, updatedProfile);
      };
      case (null) {
        Runtime.trap("User profile not found");
      };
    };
  };

  // Owner check - verifies caller is the owner based on Twitch username
  func requireOwner(caller : Principal) : () {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (not profile.isOwner) {
          Runtime.trap("Unauthorized: Only the app owner can perform this action");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Only the app owner can perform this action");
      };
    };
  };

  // Admin dashboard access - restricted to CelestiNix username
  func requireAdminDashboardAccess(caller : Principal) : () {
    // Check if caller has admin role AND matches the specific username
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin dashboard access denied");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.name != OWNER_USERNAME) {
          Runtime.trap("Unauthorized: Admin dashboard access restricted to user 'CelestiNix'");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Admin dashboard access denied - profile not found");
      };
    };
  };

  // Subscription Plan Management (Owner-only)
  public type SubscriptionPlan = {
    id : Nat;
    name : Text;
    description : Text;
    tier : SubscriptionTier;
    priceInCents : Nat;
    features : [Text];
    isActive : Bool;
  };

  module SubscriptionPlan {
    public func compare(a : SubscriptionPlan, b : SubscriptionPlan) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let subscriptionPlans = Map.empty<Nat, SubscriptionPlan>();
  var nextPlanId = 0;

  public shared ({ caller }) func createSubscriptionPlan(
    name : Text,
    description : Text,
    tier : SubscriptionTier,
    priceInCents : Nat,
    features : [Text]
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create subscription plans");
    };
    requireOwner(caller);

    let plan : SubscriptionPlan = {
      id = nextPlanId;
      name;
      description;
      tier;
      priceInCents;
      features;
      isActive = true;
    };

    subscriptionPlans.add(nextPlanId, plan);
    nextPlanId += 1;
    plan.id;
  };

  // Public query - no auth needed for viewing pricing
  public query ({ caller }) func getSubscriptionPlan(planId : Nat) : async ?SubscriptionPlan {
    subscriptionPlans.get(planId);
  };

  public query ({ caller }) func getAllSubscriptionPlans() : async [SubscriptionPlan] {
    subscriptionPlans.values().toArray().sort();
  };

  public query ({ caller }) func getActiveSubscriptionPlans() : async [SubscriptionPlan] {
    let activePlans = subscriptionPlans.values().filter(
      func(plan : SubscriptionPlan) : Bool {
        plan.isActive;
      }
    );
    activePlans.toArray().sort();
  };

  public shared ({ caller }) func updateSubscriptionPlan(
    planId : Nat,
    name : Text,
    description : Text,
    priceInCents : Nat,
    features : [Text],
    isActive : Bool
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update subscription plans");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?plan) {
        let updatedPlan = {
          plan with
          name = name;
          description = description;
          priceInCents = priceInCents;
          features = features;
          isActive = isActive;
        };
        subscriptionPlans.add(planId, updatedPlan);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  public shared ({ caller }) func deleteSubscriptionPlan(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subscription plans");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?_plan) {
        subscriptionPlans.remove(planId);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  public shared ({ caller }) func toggleSubscriptionPlanStatus(planId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle subscription plan status");
    };
    requireOwner(caller);

    switch (subscriptionPlans.get(planId)) {
      case (?plan) {
        let updatedPlan = {
          plan with isActive = not plan.isActive;
        };
        subscriptionPlans.add(planId, updatedPlan);
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };
  };

  // Admin dashboard functions - restricted to CelestiNix
  public shared ({ caller }) func getAdminDashboardStats() : async {
    totalUsers : Nat;
    activeSubscriptions : Nat;
    totalRevenue : Float;
  } {
    requireAdminDashboardAccess(caller);

    let totalUsers = userProfiles.size();
    let activeSubscriptions = userProfiles.values().filter(
      func(profile : UserProfile) : Bool {
        profile.subscriptionStatus == #active;
      }
    ).size();

    {
      totalUsers;
      activeSubscriptions;
      totalRevenue = 0.0; // Calculate from revenue entries
    };
  };

  public shared ({ caller }) func getAllUsersAdmin() : async [UserProfile] {
    requireAdminDashboardAccess(caller);
    userProfiles.values().toArray();
  };

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe integration");
    };
    requireAdminDashboardAccess(caller);
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func createStripeSubscription(planId : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can subscribe");
    };

    let plan = switch (subscriptionPlans.get(planId)) {
      case (?p) {
        if (not p.isActive) {
          Runtime.trap("Subscription plan is not active");
        };
        p;
      };
      case (null) {
        Runtime.trap("Subscription plan not found");
      };
    };

    let items : [Stripe.ShoppingItem] = [{
      currency = "usd";
      productName = plan.name;
      productDescription = plan.description;
      priceInCents = plan.priceInCents;
      quantity = 1;
    }];

    let successUrl = "https://your-frontend-success-url.com";
    let cancelUrl = "https://your-frontend-cancel-url.com";
    await createCheckoutSession(items, successUrl, cancelUrl);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Check if user has active subscription or is owner
  func hasActiveSubscription(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        profile.isOwner or profile.subscriptionStatus == #active;
      };
      case (null) { false };
    };
  };

  // Require active subscription (owner bypasses this check)
  func requireActiveSubscription(caller : Principal) : () {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.isOwner) {
          return; // Owner bypasses subscription requirement
        };
        if (profile.subscriptionStatus != #active) {
          Runtime.trap("Active subscription required to access this feature");
        };
      };
      case (null) {
        Runtime.trap("Active subscription required to access this feature");
      };
    };
  };

  // Twitch Account Management
  public type TwitchAccountStatus = { #pending; #approved; #suspended };
  public type TwitchAccount = {
    id : Nat;
    owner : Principal;
    username : Text;
    accountType : { #affiliate; #partner };
    status : TwitchAccountStatus;
  };

  module TwitchAccount {
    public func compare(a : TwitchAccount, b : TwitchAccount) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareReverse(a : TwitchAccount, b : TwitchAccount) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let twitchAccounts = Map.empty<Nat, TwitchAccount>();
  let activeTwitchAccountIds = Set.empty<Nat>();
  var nextTwitchAccountId = 0;

  public shared ({ caller }) func createTwitchAccount(username : Text, accountType : { #affiliate; #partner }) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create Twitch accounts");
    };
    requireActiveSubscription(caller);

    let account : TwitchAccount = {
      id = nextTwitchAccountId;
      owner = caller;
      username;
      accountType;
      status = #pending;
    };

    twitchAccounts.add(nextTwitchAccountId, account);
    activeTwitchAccountIds.add(nextTwitchAccountId);
    nextTwitchAccountId += 1;
    account.id;
  };

  public shared ({ caller }) func upgradeTwitchAccount(accountId : Nat, accountType : { #affiliate; #partner }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade Twitch accounts");
    };

    let account = switch (twitchAccounts.get(accountId)) {
      case (?acc) {
        if (acc.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only upgrade your own accounts");
        };
        acc;
      };
      case (null) {
        Runtime.trap("Twitch account not found");
      };
    };

    requireActiveSubscription(caller);

    let upgradedAccount = {
      account with accountType = accountType;
    };

    twitchAccounts.add(accountId, upgradedAccount);
  };

  public query ({ caller }) func getTwitchAccount(accountId : Nat) : async ?TwitchAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Twitch accounts");
    };

    requireActiveSubscription(caller);

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own accounts");
        };
        ?account;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllTwitchAccounts() : async [TwitchAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view Twitch accounts");
    };

    requireActiveSubscription(caller);

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    let accounts = activeTwitchAccountIds.values().flatMap(
      func(accountId) {
        switch (twitchAccounts.get(accountId)) {
          case (?account) {
            if (isAdmin or account.owner == caller) {
              Iter.singleton(account);
            } else {
              Iter.empty<TwitchAccount>();
            };
          };
          case (null) { Iter.empty<TwitchAccount>() };
        };
      }
    );
    accounts.toArray().sort();
  };

  public shared ({ caller }) func updateTwitchAccountStatus(accountId : Nat, status : TwitchAccountStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update Twitch accounts");
    };

    requireActiveSubscription(caller);

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own accounts");
        };

        let updatedAccount = {
          account with status = status;
        };

        twitchAccounts.add(accountId, updatedAccount);
      };
      case (null) {
        Runtime.trap("Account not found");
      };
    };
  };

  // Revenue Management (Finance Tracker)
  public type RevenueEntry = {
    id : Nat;
    accountId : Nat;
    timestamp : Nat;
    amount : Float;
    description : Text;
  };

  module RevenueEntry {
    public func compare(a : RevenueEntry, b : RevenueEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };

    public func compareReverse(a : RevenueEntry, b : RevenueEntry) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  let revenues = Map.empty<Nat, RevenueEntry>();
  var nextRevenueId = 0;

  public shared ({ caller }) func addRevenueEntry(accountId : Nat, amount : Float, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add revenues");
    };

    requireActiveSubscription(caller);

    switch (twitchAccounts.get(accountId)) {
      case (?account) {
        if (account.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add revenues to your own accounts");
        };
      };
      case (null) {
        Runtime.trap("Associated account not found");
      };
    };

    let entry : RevenueEntry = {
      id = nextRevenueId;
      accountId;
      timestamp = getCurrentTime();
      amount;
      description;
    };

    revenues.add(nextRevenueId, entry);
    nextRevenueId += 1;
    entry.id;
  };

  public query ({ caller }) func getRevenueEntry(revenueId : Nat) : async ?RevenueEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view revenue entries");
    };

    requireActiveSubscription(caller);

    switch (revenues.get(revenueId)) {
      case (?entry) {
        switch (twitchAccounts.get(entry.accountId)) {
          case (?account) {
            if (account.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view revenues for your own accounts");
            };
            ?entry;
          };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllRevenueEntries() : async [RevenueEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view revenue entries");
    };

    requireActiveSubscription(caller);

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    let filteredRevenues = revenues.values().filter(
      func(entry : RevenueEntry) : Bool {
        if (isAdmin) {
          true;
        } else {
          switch (twitchAccounts.get(entry.accountId)) {
            case (?account) { account.owner == caller };
            case (null) { false };
          };
        };
      }
    );

    filteredRevenues.toArray().sort();
  };

  func getCurrentTime() : Nat {
    0;
  };
};
